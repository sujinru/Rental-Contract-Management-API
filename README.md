# Rental Contract Management API

## Scenario
This project is designed for property management companies and landlords who need an efficient way to manage rental contracts with their tenants. It provides a centralized platform where landlords can create and distribute rental contracts, tenants can sign or reject these contracts, and landlords can track and analyze the contract status and revenue.

## Problem Statement
Managing rental contracts and tracking revenue can be a cumbersome process, often involving physical paperwork, spreadsheets, and manual calculations. This project aims to streamline this process by providing a user-friendly API that automates contract management, eliminates manual effort, and provides real-time insights into contract status and revenue projections.

## Technical Components

### Routes
- `POST /contracts/create`: Add a contract
- `GET /contracts`: Get all contracts
- `PUT /contracts/reject`: Reject a contract
- `PUT /contracts/sign`: Sign a contract
- `PUT /contracts/update`: Modify a contract
- `DELETE /contracts/one`: Remove a contract by tenant
- `GET /contracts/ValidContracts`: Get valid contracts
- `GET /contracts/ExpiredContracts`: Get expired contracts
- `GET /contracts/ContractValue`: Get valid contracts and sum up the total value 

- `POST /user/signup`: Sign up a new user
- `POST /user/login`: Log in a user
- `GET /user/tenants`: Get all tenants
- `GET /user/landlords`: Get all landlords
- `DELETE /user`: Delete a user by email

### Data Models
- `Contract`: Stores information about rental contracts, including property details, rent amount, term, tenant information, and contract status (signed or unsigned).
- `Landlord`: Stores landlord information, including authentication credentials.
- `Tenant`: Stores tenant information, including authentication credentials.

### Project Requirements
- **Authentication and Authorization**: The project implements authentication and authorization mechanisms to secure the API and ensure that only authorized landlords and tenants can access and modify data. This is achieved through the use of middleware functions that verify the user's role before allowing them to perform certain actions.
- **2 Sets of CRUD Routes**: The project includes CRUD routes for managing contracts and user accounts (landlords and tenants).
- **Indexes for Performance and Uniqueness**: Implement appropriate indexes on database collections to improve query performance and enforce uniqueness constraints where necessary.
- **Text Search, Aggregations, and Lookups**: The project utilizes MongoDB's text search, aggregations, and lookup functionality to provide advanced querying and data analysis capabilities on contracts. This allows landlords to easily search for contracts based on various criteria and analyze contract data to gain insights into their business.
- **Thorough Testing (Coverage > 80%)**: The project implements comprehensive unit tests and integration tests to ensure code quality and maintainability, with a target test coverage of at least 80%. The tests cover all major functionalities of the application, including the routes, data models, and middleware functions.

## Self-Evaluation

### Approach and Results
Our approach to this project was to create a user-friendly API that automates the process of managing rental contracts. We focused on providing a centralized platform for landlords to create, distribute, and track rental contracts. The results have been positive, with the API successfully automating many of the tasks that were previously done manually.

### Lessons Learned
As a first-time JavaScript programmer, navigating the intricacies of JavaScript syntax and debugging proved to be a substantial hurdle. Additionally, while tools like Postman and MongoDB Compass are invaluable for API development and database management, the initial learning curve required a significant time investment.

Thoroughly testing the application, with the goal of exceeding 80% coverage, also demanded more time than anticipated. The complexities of testing asynchronous operations and interactions with external services further contributed to this.

### Future Improvements
In the future, we would like to improve the error handling in our API to provide more informative error messages. We would also like to implement a more sophisticated authorization system that allows for different levels of access depending on the user's role. Additionally, we plan to provide more tools for landlords to analyze their contract data and revenue.

Overall, we are proud of what we have achieved with this project and look forward to making further improvements in the future.