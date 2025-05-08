import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';
import { MetaRegionResponseDto } from '../dtos/region.dtos';

@Injectable()
export class RegionIntegrationService implements OnModuleInit {
  private readonly logger = new Logger(RegionIntegrationService.name);
  private connectionEstablished = false;
  private connectionAttempts = 0;
  private readonly MAX_CONNECTION_ATTEMPTS = 5;
  private readonly CONNECTION_RETRY_DELAY = 2000; // 2 seconds

  constructor(
    @Inject('REGION_SERVICE') private readonly regionClient: ClientProxy,
  ) {}

  async onModuleInit() {
    // Try to pre-establish the connection to RabbitMQ
    this.logger.log('Initializing connection to RabbitMQ region service...');
    await this.ensureConnection();
    this.logger.log('Region integration service initialization completed');
  }

  private async ensureConnection(): Promise<void> {
    if (this.connectionEstablished) {
      return;
    }

    // Increment connection attempts counter
    this.connectionAttempts++;

    try {
      this.logger.log(
        `Connection attempt ${this.connectionAttempts}/${this.MAX_CONNECTION_ATTEMPTS} to RabbitMQ region service...`,
      );

      // Connect to RabbitMQ
      await this.regionClient.connect();

      // Send a ping to verify the connection is working properly
      try {
        this.logger.log('Sending ping to verify RabbitMQ connection...');
        const pingResponse = await firstValueFrom(
          this.regionClient.send('ping', {}).pipe(
            timeout(5000), // 5 second timeout
            catchError((error) => {
              this.logger.warn(`Ping timeout: ${error.message}`);
              return of({ status: false, message: 'Ping timeout' });
            }),
          ),
        );

        this.logger.log(`Ping response: ${JSON.stringify(pingResponse)}`);
      } catch (testError) {
        throw new Error(`Connection tests failed: ${testError.message}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to establish connection to RabbitMQ: ${error.message}`,
      );

      // Retry logic with exponential backoff
      if (this.connectionAttempts < this.MAX_CONNECTION_ATTEMPTS) {
        const delay =
          this.CONNECTION_RETRY_DELAY *
          Math.pow(1.5, this.connectionAttempts - 1);
        this.logger.log(`Retrying connection in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.ensureConnection();
      } else {
        this.logger.error(
          `Maximum connection attempts (${this.MAX_CONNECTION_ATTEMPTS}) reached. Giving up.`,
        );
        // Reset counter to allow future attempts
        this.connectionAttempts = 0;
      }
    }
  }

  /**
   * Get region from Oracle database only (no merging with local data)
   */
  async getOracleRegionsByDate(date: string): Promise<MetaRegionResponseDto> {
    try {
      // Ensure connection before sending message
      await this.ensureConnection();

      this.logger.log('Sending request to Oracle with params: ' + date);

      // Add detailed logging
      this.logger.log(
        `Sending RabbitMQ message to pattern 'get_meta_regions_by_date' with payload: ${JSON.stringify(date)}`,
      );

      // Use longer timeout for first connection
      const timeoutMs = this.connectionEstablished ? 300000 : 300000; // 5 minutes for all requests
      this.logger.log(`Using timeout of ${timeoutMs}ms for RabbitMQ request`);

      const metaRegionsResponse = await firstValueFrom(
        this.regionClient
          .send<MetaRegionResponseDto>('get_meta_regions_by_date', date)
          .pipe(
            timeout(timeoutMs),
            catchError((error) => {
              this.logger.error(
                `RabbitMQ request timeout after ${timeoutMs}ms: ${error.message || 'Unknown error'}`,
              );
              // Reset connection status to force reconnection on next attempt
              this.connectionEstablished = false;
              return of({
                data: [],
                count: 0,
                status: false,
                message: `Request timed out after ${timeoutMs}ms: ${error.message || 'Unknown error'}`,
              } as MetaRegionResponseDto);
            }),
          ),
      );

      // Log the response for debugging
      this.logger.log('Received response from Oracle service:', {
        status: metaRegionsResponse?.status,
        count: metaRegionsResponse?.count,
        dataLength: metaRegionsResponse?.data?.length,
        message: metaRegionsResponse?.message,
      });

      // Ensure the response has the correct structure
      const response: MetaRegionResponseDto = {
        data: metaRegionsResponse?.data || [],
        count: metaRegionsResponse?.count || 0,
        status: metaRegionsResponse?.status ?? false,
        message:
          metaRegionsResponse?.message ||
          'No data received from Oracle service',
      };

      return response;
    } catch (error) {
      this.logger.error('Error getting Oracle branches:', error);
      // Reset connection status to force reconnection on next attempt
      this.connectionEstablished = false;
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving Oracle branches: ${error?.message || 'Unknown error'}`,
      };
    }
  }
}
