# Rental Contract Management API

## Scenario
This project is designed for property management companies and landlords who need an efficient way to manage rental contracts with their tenants. It provides a centralized platform where landlords can create and distribute rental contracts, tenants can sign or reject these contracts, and landlords can track and analyze the contract status and revenue.

## Problem Statement
Managing rental contracts and tracking revenue can be a cumbersome process, often involving physical paperwork, spreadsheets, and manual calculations. This project aims to streamline this process by providing a user-friendly API that automates contract management, eliminates manual effort, and provides real-time insights into contract status and revenue projections.

## Technical Components

### Routes
- `POST /contracts`: Create a new rental contract
- `GET /contracts`: Retrieve a list of all contracts
- `GET /contracts/:id`: Retrieve a specific contract by ID
- `PUT /contracts/:id`: Update a specific contract by ID
- `DELETE /contracts/:id`: Delete a specific contract by ID
- `POST /contracts/:id/sign`: Tenant signs a specific contract
- `POST /contracts/:id/reject`: Tenant rejects a specific contract
- `GET /revenue`: Retrieve projected revenue based on signed contracts

### Data Models
- `Contract`: Stores information about rental contracts, including property details, rent amount, start and end dates, tenant information, and contract status (signed or unsigned).
- `Landlord`: Stores landlord information, including authentication credentials.
- `Tenant`: Stores tenant information, including authentication credentials.

### Project Requirements
- **Authentication and Authorization**: Implement authentication and authorization mechanisms to secure the API and ensure that only authorized landlords and tenants can access and modify data. One landlord can be multiple personnels.
- **2 Sets of CRUD Routes**: The project includes CRUD routes for managing contracts and user accounts (landlords and tenants).
- **Indexes for Performance and Uniqueness**: Implement appropriate indexes on database collections to improve query performance and enforce uniqueness constraints where necessary.
- **Text Search, Aggregations, and Lookups**: Utilize MongoDB's text search, aggregations, and lookup functionality to provide advanced querying and data analysis capabilities on contracts
- **Thorough Testing (Coverage > 80%)**: Implement comprehensive unit tests and integration tests to ensure code quality and maintainability, with a target test coverage of at least 80%.

## Timeline

### Done as of May 26
- Set up project structure and dependencies
- Implement user authentication and authorization
- Design and implement data models for contracts, landlords, and tenants
- Implement CRUD routes for managing contracts

### Week 8
- Set up project structure and dependencies
- Implement user authentication and authorization
- Design and implement data models for contracts, landlords, and tenants
- Implement CRUD routes for managing contracts

### Week 9
- Implement contract signing and rejection functionality
- Set up database indexes and perform initial testing
- Implement revenue projection and reporting functionality
- Integrate with payment gateway and document signing services (if applicable)

### Week 10
- Implement text search, aggregations, and lookup functionality
- Expand test coverage and refine existing tests
- Finalize documentation and project cleanup
- Perform final testing and code review
- Prepare for project presentation and submission