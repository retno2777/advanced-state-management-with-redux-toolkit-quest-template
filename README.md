# E-Commerce Backend API

This project is a backend API for an E-Commerce platform that supports authentication and authorization for **Sellers**, **Shoppers**, and **Admins**. It is built using **Node.js** and **Express.js**, with **Redux** for state management in the frontend. The API handles login, registration, and various functionalities for each user role.

## Features

- **Authentication**:
  - Register, login, and manage authentication using **JWT** (JSON Web Tokens).
  - Support for **Sellers**, **Shoppers**, and **Admins**.

- **Authorization**:
  - Different endpoints for sellers, shoppers, and admins, with role-based access control.

- **Admin Functionalities**:
  - View all sellers and shoppers.
  - Deactivate and activate users.
  - Delete users, if the user **doesn't have active transactions**.

- **Seller Functionalities**:
  - **Profile Management**:
    - Load, update, and delete seller profiles.
    - Upload and manage profile images.
    - Change passwords and email addresses.
  - **Product Management**:
    - Create, update, and delete products.
    - Upload product images.
    - View all products or a specific product by ID.
  - **Order Management**:
    - View seller orders and order history.
    - Update the shipping status of orders.
    - Handle refund requests (approve or reject).
  - **Restricted Access**:
    - Only active sellers can create, update, or delete products and manage orders.
    - Profile deletion is restricted if the seller has active transactions.
- **Shopper Functionalities**:
    - **Profile Management**:
        - Load, update, and delete shopper profiles.
        - Upload and manage profile images.
        - Change passwords and email addresses.
        - Profile deletion is restricted if there are active transactions.

    - **Cart Management**:
        - View items in the cart.
        - Add items to the cart.
        - Reduce item quantity or remove items from the cart.

    - **Order Management**:
        - Checkout selected items from the cart.
        - View order items and order history.
        - Request order cancellation or refund.

    - **Payment Simulation**:
        - Simulate payments for orders.
        - Confirm receipt of orders after   delivery.

    - **Product Viewing**:
        - View all available products.


- **State Management (Frontend)**:
  - Uses **Redux** to manage global state for authentication, products, and user actions.
  - Simplifies the state flow between authentication and different user roles.

- **CORS Support**:
  - Configured for specific frontend origins, supporting credentials.

## Requirements

- **Node.js** (v14+)
- **yarn**
- **Redux** for state management in frontend.
- **SQlite** or any preferred database (depending on further implementation).

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```bash
TOKEN=your_jwt_secret_key
PORT=4040
```

