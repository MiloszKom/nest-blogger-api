# **Blogger API - NestJS Project**

This project is a RESTfull blog API backend build with Nest.js. The project includes a reliable architecture with distinct modules for user authentication and post management.

## **Link to the Swagger Docs**
[https://nest-blogger-api.onrender.com](https://nest-blogger-api.onrender.com)

## **Features**
- User registration and login with JWT-based authentication
- Full CRUD support for managing blog posts
- Data validation for users and posts via Data Transfer Objects (DTOs)
- Integrated Swagger UI for streamlined API exploration and testing
- Continuous Integration pipeline that runs unit and e2e tests automatically before deployment to ensure code quality and reliability
  
## **Run Locally with Docker**

#### **1. Clone the repository**
```bash
git clone https://github.com/MiloszKom/nest-blogger-api.git
cd nest-blogger-api
```

#### **2. Create an .env.dev file in the root of the project**

#### **3. Build and start the containers**
In the root directory type:
```bash
npm run docker:dev
```

#### **4. Access the API**
Once the containers are running, open your browser or API client and navigate to:
```bash
http://localhost:3000
```

**Note:**
The server is configured to run with default environment settings. Although it does not require any specific variables to be defined, it does require a .env.dev file to exist in the root directory. This file can be empty unless you want to override the default values listed below:
```bash
NODE_ENV=development

DB_HOST=postgres
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=test
DB_SYNC=true
DB_SSL=false

JWT_SECRET=secret_key
JWT_EXPIRES_IN=1d
```

