import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../../../common/services/prisma.service';
import { CustomerResponseDto } from '../dtos/customer.dtos';
import {
  MetaCustomerResponseDto,
  MergedCustomerDto,
  MergedCustomerResponseDto,
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
    private readonly prismaService: PrismaService,
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
   * Get customers from both databases and merge them
   */
  async getMergedCustomers(): Promise<MergedCustomerResponseDto> {
    try {
      // Ensure connection before sending message
      await this.ensureConnection();

      // Get local customers
      const localCustomers = await this.prismaService.customers.findMany();
      this.logger.log(
        `Retrieved ${localCustomers.length} customers from local database`,
      );

      // Use longer timeout for first connection
      const timeoutMs = this.connectionEstablished ? 20000 : 40000; // 20 seconds normally, 40 seconds for first connection
      this.logger.log(`Using timeout of ${timeoutMs}ms for RabbitMQ request`);

      // Get meta customers from Oracle via RabbitMQ
      const metaCustomersResponse = await firstValueFrom(
        this.customerClient
          .send<MetaCustomerResponseDto>('get_meta_customers', {})
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

      if (!metaCustomersResponse.status) {
        return {
          data: this.transformToMergedCustomers(localCustomers, []),
          count: localCustomers.length,
          status: true,
          message:
            'Customers retrieved from local database only. ' +
            metaCustomersResponse.message,
        };
      }

      const metaCustomers = metaCustomersResponse.data;

      // Merge data
      const mergedCustomers = this.transformToMergedCustomers(
        localCustomers,
        metaCustomers,
      );

      return {
        data: mergedCustomers,
        count: mergedCustomers.length,
        status: true,
        message:
          'Customers retrieved from both databases and merged successfully',
      };
    } catch (error) {
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving merged customers: ${error.message}`,
      };
    }
  }

  /**
   * Get a specific customer by ID from both databases and merge the data
   */
  async getMergedCustomerById(
    customerId: number,
  ): Promise<MergedCustomerResponseDto> {
    try {
      // Ensure connection before sending message
      await this.ensureConnection();

      this.logger.log(
        `Getting customer with ID ${customerId} from both databases`,
      );

      // Get local customer
      const localCustomer = await this.prismaService.customers.findUnique({
        where: { id: customerId },
      });

      if (!localCustomer) {
        return {
          data: [],
          count: 0,
          status: false,
          message: `Customer with ID ${customerId} not found in local database`,
        };
      }

      // Get all meta customers to find a match by name
      // In a real implementation, we might want to use a more specific identifier

      // Use longer timeout for first connection
      const timeoutMs = this.connectionEstablished ? 20000 : 40000; // 20 seconds normally, 40 seconds for first connection
      this.logger.log(`Using timeout of ${timeoutMs}ms for RabbitMQ request`);

      const metaCustomersResponse = await firstValueFrom(
        this.customerClient
          .send<MetaCustomerResponseDto>('get_meta_customers', {})
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

      // If no meta data, return just the local data
      if (!metaCustomersResponse.status || metaCustomersResponse.count === 0) {
        const mergedCustomer = this.mapToMergedCustomer(localCustomer);
        return {
          data: [mergedCustomer],
          count: 1,
          status: true,
          message: 'Customer retrieved from local database only',
        };
      }

      // Find the matching meta customer by name
      // Note: This is a simple example - in a real implementation you would use a more reliable identifier
      // that exists in both systems or implement a more sophisticated matching algorithm
      const matchingMetaCustomer = metaCustomersResponse.data.find(
        (metaCustomer) =>
          metaCustomer.customer_name.toLowerCase() ===
          localCustomer.name.toLowerCase(),
      );

      // Merge the data
      const mergedCustomer = this.mapToMergedCustomer(
        localCustomer,
        matchingMetaCustomer || undefined,
      );

      return {
        data: [mergedCustomer],
        count: 1,
        status: true,
        message: matchingMetaCustomer
          ? 'Customer retrieved and merged from both databases'
          : 'Customer retrieved from local database only, no matching record in Oracle',
      };
    } catch (error) {
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving merged customer: ${error.message}`,
      };
    }
  }

  /**
   * Transform local and meta customers into merged customer objects
   */
  private transformToMergedCustomers(
    localCustomers: CustomerResponseDto[],
    metaCustomers: any[],
  ): MergedCustomerDto[] {
    // Map each local customer to a merged customer
    return localCustomers.map((localCustomer) => {
      // Try to find matching meta customer by name
      // Note: This is a simple matching strategy - in a real implementation you would use a more reliable linking mechanism
      const matchingMetaCustomer = metaCustomers.find(
        (meta) =>
          meta.customer_name.toLowerCase() === localCustomer.name.toLowerCase(),
      );

      // Return merged customer data
      return this.mapToMergedCustomer(localCustomer, matchingMetaCustomer);
    });
  }

  /**
   * Map a local customer and optional meta customer to a merged customer object
   */
  private mapToMergedCustomer(
    localCustomer: CustomerResponseDto,
    metaCustomer?: any,
  ): MergedCustomerDto {
    const merged: MergedCustomerDto = {
      // Local customer data
      id: localCustomer.id,
      name: localCustomer.name,
      alias: localCustomer.alias,
      category: localCustomer.category,
      owner: localCustomer.owner,
      phone: localCustomer.phone,
      npwp: localCustomer.npwp,
      ktp: localCustomer.ktp,
      route_id: localCustomer.route_id,
      is_active: localCustomer.is_active,
      created_by: localCustomer.created_by,
      created_at: localCustomer.created_at,
      updated_by: localCustomer.updated_by,
      updated_at: localCustomer.updated_at,
    };

    // If there's a matching meta customer, add its data
    if (metaCustomer) {
      Object.assign(merged, {
        cust_account_id: metaCustomer.cust_account_id,
        address1: metaCustomer.address1,
        bill_to_location: metaCustomer.bill_to_location,
        bill_to_site_use_id: metaCustomer.bill_to_site_use_id,
        channel: metaCustomer.channel,
        credit_checking: metaCustomer.credit_checking,
        credit_exposure: metaCustomer.credit_exposure,
        customer_number: metaCustomer.customer_number,
        kab_kodya: metaCustomer.kab_kodya,
        kecamatan: metaCustomer.kecamatan,
        kelurahan: metaCustomer.kelurahan,
        last_update_date: metaCustomer.last_update_date,
        order_type_id: metaCustomer.order_type_id,
        order_type_name: metaCustomer.order_type_name,
        org_id: metaCustomer.org_id,
        org_name: metaCustomer.org_name,
        organization_code: metaCustomer.organization_code,
        organization_id: metaCustomer.organization_id,
        organization_name: metaCustomer.organization_name,
        overall_credit_limit: metaCustomer.overall_credit_limit,
        price_list_id: metaCustomer.price_list_id,
        price_list_name: metaCustomer.price_list_name,
        provinsi: metaCustomer.provinsi,
        return_order_type_id: metaCustomer.return_order_type_id,
        return_order_type_name: metaCustomer.return_order_type_name,
        ship_to_location: metaCustomer.ship_to_location,
        ship_to_site_use_id: metaCustomer.ship_to_site_use_id,
        site_type: metaCustomer.site_type,
        term_day: metaCustomer.term_day,
        term_id: metaCustomer.term_id,
        term_name: metaCustomer.term_name,
        trx_credit_limit: metaCustomer.trx_credit_limit,
      });
    }

    return merged;
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
