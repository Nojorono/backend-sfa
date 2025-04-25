# Customer Microservice Documentation

This document outlines how to interact with the Customer microservice using RabbitMQ.

## Overview

The Customer microservice provides communication services for customer data operations through RabbitMQ. It allows other microservices to perform CRUD operations on customer data without direct HTTP calls.

## Connection Details

- Queue name: `customer_queue` (defined in environment variables as `RABBITMQ_CUSTOMER_QUEUE`)
- RabbitMQ Connection URL: Defined in environment variable `RABBITMQ_URL`

## Available Message Patterns

### 1. Get All Customers

Retrieve a list of all customers.

- **Pattern**: `get_customers`
- **Payload**: None required
- **Response**: Array of `CustomerResponseDto` objects

Example:

```typescript
// Client-side code
const customers = await client.send('get_customers', {}).toPromise();
```

### 2. Get Customer by ID

Retrieve a specific customer by ID.

- **Pattern**: `get_customer_by_id`
- **Payload**: `{ customerId: number }`
- **Response**: `CustomerResponseDto` object

Example:

```typescript
// Client-side code
const customer = await client
  .send('get_customer_by_id', { customerId: 1 })
  .toPromise();
```

### 3. Create Customer

Create a new customer.

- **Pattern**: `create_customer`
- **Payload**: `CreateCustomerDto` object
- **Response**: Created `CustomerResponseDto` object

Example:

```typescript
// Client-side code
const newCustomer = {
  name: 'Customer Name',
  alias: 'Alias',
  category: 'Category',
  owner: 'Owner',
  phone: '123456789',
  npwp: 'NPWP',
  ktp: 'KTP',
  route_id: 1,
  is_active: true,
};

const createdCustomer = await client
  .send('create_customer', newCustomer)
  .toPromise();
```

### 4. Update Customer

Update an existing customer.

- **Pattern**: `update_customer`
- **Payload**: `{ customerId: number, updateData: UpdateCustomerDto }`
- **Response**: Updated `CustomerResponseDto` object

Example:

```typescript
// Client-side code
const updateData = {
  name: 'Updated Name',
  is_active: false,
  // other fields to update
};

const updatedCustomer = await client
  .send('update_customer', {
    customerId: 1,
    updateData,
  })
  .toPromise();
```

### 5. Delete Customers

Delete one or more customers by their IDs.

- **Pattern**: `delete_customers`
- **Payload**: `{ customerIds: number[] }`
- **Response**: `GenericResponseDto` object

Example:

```typescript
// Client-side code
const result = await client
  .send('delete_customers', {
    customerIds: [1, 2, 3],
  })
  .toPromise();
```

## Client Implementation

To implement a client that communicates with this microservice, use the NestJS microservices module:

```typescript
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:master123@localhost:5672'],
          queue: 'customer_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  // ...
})
```

Then inject the client in your service:

```typescript
constructor(
  @Inject('CUSTOMER_SERVICE') private customerClient: ClientProxy,
) {}

// Example usage
async getCustomers() {
  return this.customerClient.send('get_customers', {}).toPromise();
}
```

## Notes

- Make sure to handle RabbitMQ connection errors properly
- All operations are asynchronous
- Remember that role names in the database are stored in uppercase (e.g., 'SUPERADMIN')
