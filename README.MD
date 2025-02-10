# MERN Authentication

This is a MERN (MongoDB, Express, React, Node.js) stack application for user authentication.

## Features

- User registration
- User login
- User logout
- JWT-based authentication
- Password hashing with bcrypt
- Environment variable configuration

## Prerequisites

- Node.js
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/MERN-Auth.git
    cd MERN-Auth
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```plaintext
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development
    ```

4. Start the server:

    ```bash
    npm start
    ```

    or

    ```bash
    yarn start
    ```

## API Endpoints

### Register

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Response:**
    ```json
    {
      "success": true,
      "message": "User Registered Successfully"
    }
    ```

### Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
- **Response:**
    ```json
    {
      "success": true,
      "message": "User Logged in Successfully"
    }
    ```

### Logout

- **URL:** `/api/auth/logout`
- **Method:** `POST`
- **Response:**
    ```json
    {
      "success": true,
      "message": "Logged out Successfully"
    }
    ```

## License

This project is licensed under the MIT License.