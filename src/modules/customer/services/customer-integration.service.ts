import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MetaCustomerResponseDto,
  PaginationParamsDto,
} from '../dtos/meta-customer.dto';
import { firstValueFrom, timeout, catchError, of } from 'rxjs';

@Injectable()
export class CustomerIntegrationService implements OnModuleInit {
  private readonly logger = new Logger(CustomerIntegrationService.name);
  private connectionEstablished = false;
  private connectionAttempts = 0;
  private readonly MAX_CONNECTION_ATTEMPTS = 5;
  private readonly CONNECTION_RETRY_DELAY = 2000; // 2 seconds

  constructor(
    @Inject('CUSTOMER_SERVICE') private readonly customerClient: ClientProxy,
  ) {}

  async onModuleInit() {
    // Try to pre-establish the connection to RabbitMQ
    this.logger.log('Initializing connection to RabbitMQ customer service...');
    await this.ensureConnection();
    this.logger.log('Customer integration service initialization completed');
  }

  private async ensureConnection(): Promise<void> {
    if (this.connectionEstablished) {
      return;
    }

    // Increment connection attempts counter
    this.connectionAttempts++;

    try {
      this.logger.log(
        `Connection attempt ${this.connectionAttempts}/${this.MAX_CONNECTION_ATTEMPTS} to RabbitMQ customer service...`,
      );

      // Connect to RabbitMQ
      await this.customerClient.connect();

      // Send a ping to verify the connection is working properly
      try {
        this.logger.log('Sending ping to verify RabbitMQ connection...');
        const pingResponse = await firstValueFrom(
          this.customerClient.send('ping', {}).pipe(
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
   * Get customers from Oracle database only (no merging with local data)
   */
  async getOracleCustomers(
    params?: PaginationParamsDto,
  ): Promise<MetaCustomerResponseDto> {
    try {
      // Ensure connection before sending message
      await this.ensureConnection();

      // Set default values if not provided
      const paginationParams: PaginationParamsDto = {
        page: params?.page || undefined,
        limit: params?.limit || undefined,
      };

      console.log('paginationParams', paginationParams);

      this.logger.log(
        'Sending request to Oracle with params:',
        paginationParams,
      );

      // Add detailed logging
      this.logger.log(
        `Sending RabbitMQ message to pattern 'get_meta_customers' with payload: ${JSON.stringify(paginationParams)}`,
      );

      // Use longer timeout for first connection
      const timeoutMs = this.connectionEstablished ? 300000 : 300000; // 5 minutes for all requests
      this.logger.log(`Using timeout of ${timeoutMs}ms for RabbitMQ request`);

      const metaCustomersResponse = await firstValueFrom(
        this.customerClient
          .send<MetaCustomerResponseDto>('get_meta_customers', paginationParams)
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
              } as MetaCustomerResponseDto);
            }),
          ),
      );

      // Log the response for debugging
      this.logger.log('Received response from Oracle service:', {
        status: metaCustomersResponse?.status,
        count: metaCustomersResponse?.count,
        dataLength: metaCustomersResponse?.data?.length,
        message: metaCustomersResponse?.message,
      });

      // Ensure the response has the correct structure
      const response: MetaCustomerResponseDto = {
        data: metaCustomersResponse?.data || [],
        count: metaCustomersResponse?.count || 0,
        status: metaCustomersResponse?.status ?? false,
        message:
          metaCustomersResponse?.message ||
          'No data received from Oracle service',
      };

      // Add pagination metadata if available
      if (metaCustomersResponse?.currentPage !== undefined) {
        response.currentPage = metaCustomersResponse.currentPage;
        response.limit = metaCustomersResponse.limit;
        response.totalPages = metaCustomersResponse.totalPages;
      }

      return response;
    } catch (error) {
      this.logger.error('Error getting Oracle customers:', error);
      // Reset connection status to force reconnection on next attempt
      this.connectionEstablished = false;
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving Oracle customers: ${error?.message || 'Unknown error'}`,
      };
    }
  }

  /**
   * Get a specific customer by ID from Oracle database only
   */
  async getOracleCustomerById(
    customerId: number,
  ): Promise<MetaCustomerResponseDto> {
    try {
      // Ensure connection before sending message
      await this.ensureConnection();

      this.logger.log(
        `Sending request to get Oracle customer by ID: ${customerId}`,
      );

      // Use longer timeout for first connection
      const timeoutMs = this.connectionEstablished ? 20000 : 40000; // 20 seconds normally, 40 seconds for first connection
      this.logger.log(`Using timeout of ${timeoutMs}ms for RabbitMQ request`);

      // Get meta customer by ID from Oracle via RabbitMQ
      const metaCustomerResponse = await firstValueFrom(
        this.customerClient
          .send<MetaCustomerResponseDto>('get_meta_customer_by_id', {
            customerId,
          })
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
              } as MetaCustomerResponseDto);
            }),
          ),
      );

      return (
        metaCustomerResponse || {
          data: [],
          count: 0,
          status: false,
          message: 'Failed to retrieve data from Oracle (null response)',
        }
      );
    } catch (error) {
      this.logger.error(
        `Error getting Oracle customer by ID ${customerId}:`,
        error,
      );
      // Reset connection status to force reconnection on next attempt
      this.connectionEstablished = false;
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving Oracle customer: ${error?.message || 'Unknown error'}`,
      };
    }
  }

  /**
   * Invalidate customer cache in the meta service
   * @param customerId Optional customer ID to invalidate specific customer cache
   * If not provided, all customer caches will be invalidated
   * @returns A promise that resolves to the status of the invalidation
   */
  async invalidateCustomerCache(
    customerId?: number,
  ): Promise<{ status: boolean; message: string }> {
    try {
      // Ensure connection before sending message
      await this.ensureConnection();

      this.logger.log(
        `Sending request to invalidate customer cache ${customerId ? `for ID: ${customerId}` : '(all customers)'}`,
      );

      // Use default timeout for cache invalidation
      const timeoutMs = 10000; // 10 seconds timeout for cache operations

      // Send invalidation request
      const response = await firstValueFrom(
        this.customerClient
          .send<{ status: boolean; message: string }>(
            'invalidate_customer_cache',
            {
              customerId,
            },
          )
          .pipe(
            timeout(timeoutMs),
            catchError((error) => {
              this.logger.error(
                `Cache invalidation request timeout after ${timeoutMs}ms: ${error.message || 'Unknown error'}`,
              );
              return of({
                status: false,
                message: `Cache invalidation request timed out after ${timeoutMs}ms: ${error.message || 'Unknown error'}`,
              });
            }),
          ),
      );

      this.logger.log(
        `Cache invalidation response: ${JSON.stringify(response)}`,
      );
      return (
        response || {
          status: false,
          message: 'Failed to invalidate cache (null response)',
        }
      );
    } catch (error) {
      this.logger.error(
        `Error invalidating customer cache ${customerId ? `for ID ${customerId}` : '(all customers)'}:`,
        error,
      );
      return {
        status: false,
        message: `Error invalidating customer cache: ${error?.message || 'Unknown error'}`,
      };
    }
  }
}
