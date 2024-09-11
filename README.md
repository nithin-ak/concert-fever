# concert-fever
A full stack application using React for front end and Java-Spring Boot for backend with MariaDB as the database

# Frontend Configuration

1. Navigate to the frontend folder and access the project folder via terminal
    
    ```bash
    cd <yourpathtofolder>/concertfever-frontend
    ```
    
2. Initialize the project
    
    *I’ve used pnpm as the package manager. You can use npm as well.*
    
    ```bash
    pnpm install
    ```
    
3. Run the frontend
    
    ```bash
    pnpm run dev
    ```
    
4. To stop the frontend use `Ctrl + C` to terminate the process.

# Backend Configuration

## Database:

Make sure you have MariaDB configured as your database.

1. Create a new database with the name **`concertfever`**
    1. SQL Command
    
    ```sql
    CREATE DATABASE IF NOT EXISTS concertfever;
    ```
    
2. [**OPTIONAL**] The DDL and DML scripts should auto-execute during Spring project startup, but if you’d like to do it manually, here are paths for the respective files:
    
    Folder path: `<yourpathtofolder>/concertfever-backend/src/main/resources`
    
    1. **DDL**: `schema.sql`
    2. **DML**: `data.sql`

### Important!

Regardless of how you instantiate your DDL and DML, the Spring [application.properties](http://application.properties/) is set to `spring.sql.init.mode=always`, which ensures SQL scripts are always executed, i.e., data is reset every execution.

If you’d like the data to persist post-initial run, please change this setting to `never`.

## Spring Project

### a. Run project via Terminal

Assuming you’ve set your username and password as `root` for the database:

1. Navigate to the backend folder and access the project folder via terminal
    
    ```bash
    cd <yourpathtofolder>/concertfever-backend
    ```
    
2. Run the backend
    
    ```bash
    ./mvnw spring-boot:run
    ```
    
3. To stop the backend, use `Ctrl + C` to terminate the process.

If the database name, username, or password is different, please access the [`application.properties`](http://application.properties/) file at folder `<yourpathtofolder>/concertfever-backend/src/main/resources` and modify the following entries:

```java
# MariaDB properties
spring.datasource.url=jdbc:mariadb://localhost:3306/<yourDBname>
spring.datasource.username=<yourDBusername>
spring.datasource.password=<yourDBpassword>
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
```

### b. Run project via IntelliJ

Alternatively, if you prefer to run the backend via IntelliJ, open the project and run the `ConcertfeverBackendApplication.java` file.

# Accessing the Website

Use a web browser to access the link: [http://localhost:5173/](http://localhost:5173/)

### Demo Account:

> **Email**: john.doe@test.com
> 
> 
> **Password**: password
> 

---

# API Endpoints

This section provides an overview of the API endpoints available in the ConcertFever backend, including their payloads.

Use postman to individually test each endpoint.

A postman workspace with samples has been included. Please import `ConcertFever_Tests.postman_collection.json` to your postman workspace to begin testing.

## Endpoints

| Endpoint | Method | Payload | Used by React? |
| --- | --- | --- | --- |
| /user/getallusers | GET | None | No |
| /user/getuserbyemail | GET | email (query parameter) | Yes |
| /user/getuserpassword | GET | email (query parameter) | Yes |
| /user/getuseraccountbalance | GET | email (query parameter) | Yes |
| /user/topupaccountbalance | PUT | Refer to Payload - Top Up Balance | No |
| /user/createnewuser | POST | Refer to Payload - Create User | Yes |
| /user/changeuserpassword | PUT | Refer to Payload - Change Password | Yes |
| /user/updateuserlogintime | PUT | Refer to Payload - Update Login Time | Yes |
| /ticket/getalluserticketsbyemail | GET | email (query parameter) | Yes |
| /ticket/getallticketcategoriesbyeventid | GET | eventId (query parameter) | Yes |
| /ticket/purchasetickets | POST | Refer to Payload - Purchase Tickets | Yes |
| /event/getallevents | GET | None | Yes |
| /event/getalleventsbycategory | GET | category (query parameter) | Yes |
| /event/getalleventsfulldetails | GET | None | Yes |
| /event/geteventfulldetailsbycategory | GET | category (query parameter) | No |
| /event/geteventfulldetailsbyeventid | GET | eventId (query parameter) | Yes |

## Payload Blocks

### Payload - Top Up Balance

```json
{
    "email": "john.doe@test.com",
    "topUp": 50.00
}
```

### Payload - Create User

```json
{
    "firstName": "Mike",
    "lastName": "Tyson",
    "email": "mike.tyson@test.com",
    "password": "boxing",
    "accountBalance": 1000
}
```

### Payload - Change Password

```json
{
    "email": "john.doe@test.com",
    "password": "newpassword"
}
```

### Payload - Update Login Time

```json
{
    "email": "john.doe@test.com"
}
```

### Payload - Purchase Tickets

```json
{
    "userId": 10006,
    "couponId": 1,
    "tickets": [
        {
            "eventId": 1,
            "ticketCategory": "B",
            "finalPrice": 150.00
        },
        {
            "eventId": 1,
            "ticketCategory": "C",
            "finalPrice": 150.00
        }
    ]
}
```
