## 💊 Pharma E-Commerce Backend API 💊

This project is a backend API designed for a **Pharmaceutical E-Commerce platform** as part of a **quest on the StackUp Platform**.. It supports Sellers, Shoppers, and Admin functionalities, ensuring secure authentication and authorization. Built using Node.js and Express.js, the frontend integrates Redux for state management. The API facilitates user roles such as registering, logging in, managing products, handling orders, and overseeing platform operations, specifically tailored for the pharmaceutical industry.

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
    -**Profile Management**:
        - Load, update, and delete shopper profiles.
        - Upload and manage profile images.
        - Change passwords and email addresses.
        - Profile deletion is restricted if there are active transactions.
    -**Cart Management**:
        - View items in the cart.
        - Add items to the cart.
        - Reduce item quantity or remove items from the cart.

    -**Order Management**:
        - Checkout selected items from the cart.
        - View order items and order history.
        - Request order cancellation or refund.
    -**Payment Simulation**:
        - Simulate payments for orders.
        - Confirm receipt of orders after   delivery.
    -**Product Viewing**:
        - View all available products.

- **State Management (Frontend)**:
    - Utilizes Redux Toolkit for managing global state, including authentication, product management, and user actions.
    - Simplifies state flow for different user roles such as Sellers, Shoppers, and Admins, ensuring that data is consistently available across the app.
    - Handles async operations, like API calls for registration and login, using createAsyncThunk for better state handling.

- **CORS Support**:
    - Configured for specific frontend origins, supporting credentials.



## Requirements

- **Node.js** (v14+)
- **yarn**
- **Redux** for state management in frontend.
- **SQlite** or any preferred database (depending on further implementation).

## Demo picture
  - Home
    ![Home](https://github.com/retno2777/advanced-state-management-with-redux-toolkit-quest-template/blob/main/assetReadme/Home.png)
  - Admin
    ![Admin](https://github.com/retno2777/advanced-state-management-with-redux-toolkit-quest-template/blob/main/assetReadme/Admin.png)
  - Shopper
    ![Shopper](https://github.com/retno2777/advanced-state-management-with-redux-toolkit-quest-template/blob/main/assetReadme/Shopper.png)
  - Seller
    ![Seller](https://github.com/retno2777/advanced-state-management-with-redux-toolkit-quest-template/blob/main/assetReadme/Seller.png)

## Demo Video
  [Watch the video here](https://drive.google.com/file/d/1o_vAwOK5ebIc-7cLFhMAxoyDyhPRk1t2/view?usp=drive_link)

## Root API Endpoints

### 1. Admin Root Route
- **Base URL:** `/api/admin`
- **Description:** This route is used to handle admin functionalities like managing users (sellers and shoppers).

#### Example Endpoints:
1. **View All Sellers**
   - **Method:** `GET`
   - **URL:** `/api/admin/sellers`
   - **Description:** Retrieves a list of all registered sellers.
   - **Protected Route:** Yes (Admin Access Required)

2. **Deactivate a User**
   - **Method:** `PUT`
   - **URL:** `/api/admin/deactivate-user`
   - **Description:** Deactivates a seller or shopper account.
   - **Protected Route:** Yes (Admin Access Required)

### 2. Seller Root Route
  - **Base URL:** `/api/seller`
  - **Description:** This route is used to handle seller functionalities like managing profiles, products, and orders.

#### Example Endpoints:
1. **Create a Product**
  - **Method:** `POST`
  - **URL:** `/api/seller/products`
  - **Description:** Allows sellers to create a new product.
  - **Protected Route:** Yes (Seller Access Required)
  - **Payload Example:**
     ```json
     {
       "productName": "Sample Product",
       "price": 100,
       "stock": 10,
       "description": "A description of the product"
     }
     ```

2. **View Seller Orders**
  - **Method:** `GET`
  - **URL:** `/api/seller/orders`
  - **Description:** Retrieves all orders placed with the seller.
  - **Protected Route:** Yes (Seller Access Required)

### 3. Shopper Root Route
  - **Base URL:** `/api/shopper`
  - **Description:** This route is used to handle shopper functionalities like managing profiles, shopping carts, and orders.

#### Example Endpoints:
1. **View Cart**
   - **Method:** `GET`
   - **URL:** `/api/shopper/cart`
   - **Description:** Retrieves the current shopping cart items for the logged-in shopper.
   - **Protected Route:** Yes (Shopper Access Required)

2. **Checkout**
   - **Method:** `POST`
   - **URL:** `/api/shopper/checkout`
   - **Description:** Allows a shopper to checkout items from the cart.
   - **Protected Route:** Yes (Shopper Access Required)
   - **Payload Example:**
     ```json
     {
       "productIds": [1, 2, 3],
       "totalAmount": 250
     }
     ```

## Getting Started

  To get a local copy up and running, follow these simple steps.

### Prerequisites
- Ensure you have **Node.js** and **npm/yarn** installed.
- Additional you may have **DB Browser for SQLite** or **SQLite CLI** to read database.

## Installation

  Follow these steps to set up the project locally:

1. **Clone the repository:**

  Clone the repository to your local machine using the following command:
  ```bash
  git clone https://github.com/retno2777/advanced-state-management-with-redux-toolkit-quest-template.git 
  ```

2. Navigate to the project directory:    
  ```bash 
  cd advanced-state-management-with-redux-toolkit-quest-template 
  ```
3. Install dependencies :
  ```bash
  corepack enable
  yarn set version stable
  yarn install
  ```
4. Environment Variables

  Create `.env` file in the ``packages\backend`` directory with the following variables:

  ```bash
  TOKEN=your_jwt_secret_key
  ```

  after that running this command in ``packages\backend``
  ```bash
  cp .env.example .env
  ```
5. Run the backend server
  ```bash
  yarn backend:serve
  ```
6. Run the frontend client
  ```bash
  yarn frontend:dev
  ```
7. Access the Application Open your browser and navigate to 
  ```bash
  http://localhost:5173 
  ```
## Dummy Data for Testing

  You can use the following dummy user credentials for testing the authentication and functionality of the platform:

  | Email                | Password   |
  |----------------------|------------|
  | rm@gmail.com         | 12345      |
  | rm2@gmail.com        | 12345      |
  | john@gmail.com       | 12345      |
  | don@gmail.com        | 12345      |
  | admin1@example.com   | Admin123!  |

  Use these accounts to test different roles and actions in the platform.

## Conclusion

  The **Pharma E-Commerce Backend API** offers a robust solution for managing an online pharmaceutical store. With role-based access control for **Sellers**, **Shoppers**, and **Admins**, it provides a secure and efficient way to handle various operations such as product management, order handling, and user authentication. Integrated with **Redux** for frontend state management, it ensures smooth interactions between the backend API and the user interface. 

  This project is scalable and can easily be extended to support more features as the business grows. It's a solid foundation for anyone looking to build a full-stack e-commerce platform.

  We hope you find it useful and encourage contributions to further improve and expand its capabilities! 🚀
