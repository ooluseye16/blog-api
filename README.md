# Blog API

This is a RESTful API for a blog application, built using Node.js, Express, and MongoDB. It provides endpoints for managing blog posts, users, and authentication.

## Features

- User authentication with JWT
- CRUD operations for blog posts
- User management
- API documentation with Swagger

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Swagger for API documentation

## Getting Started

### Links

Access the live demo of the API [here](https://blog-api-production-d876.up.railway.app/).
An app built with the same API is available [here](https://blog-app-tirioh.vercel.app/posts).

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB instance running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blog-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd blog-api
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:

   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

- To start the server in development mode:

  ```bash
  npm run dev
  ```

- To start the server in production mode:

  ```bash
  npm start
  ```

### Running Tests

- To run the tests:

  ```bash
  npm test
  ```

## API Documentation

The API documentation is available at `/api-docs` when the server is running.

## License

This project is licensed under the ISC License.
