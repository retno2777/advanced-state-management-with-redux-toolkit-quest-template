import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import RegisterSeller from './pages/RegisterSeller';
import RegisterShopper from './pages/RegisterShopper';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import HomeShopper from './pages/HomeShopper';
import SellerDashboard from './pages/HomeSeller';
import ProductPageSeller from './pages/product/ProductPageSeller';
import CreateProductPage from './pages/product/CreateProductPage';
import UpdateProductPage from './pages/product/UpdateProductPage';
import UpdateProfile from './pages/seller/updateProfile';
import ChangeSellerPassword from './pages/seller/changePassword';
import ChangeSellerEmail from './pages/seller/ChangeEmail';
import ShopperProfilePage from './pages/shopper/shopperProfilePage';
import UpdateShopperProfilePage from './pages/shopper/updateProfileShopper';
import ChangeShopperEmail from './pages/shopper/ChangeShopperEmail';
import ChangeShopperPassword from './pages/shopper/changeShopperPassword';
import OrderPagePending from './pages/order/orderShopper/orderPagePending';
import OrderPageShipping from './pages/order/orderShopper/orderPageShipping';
import OrderPageDelivered from './pages/order/orderShopper/orderPageDelivered';
import OrderPageRR from './pages/order/orderShopper/orderPageRR';
import OrderHistoryPage from './pages/order/orderShopper/OrderHistoryPage';
import SellerPendingOrdersPage from './pages/order/orderSeller/SellerPendingOrdersPage';
import SellerPaidOrdersPage from './pages/order/orderSeller/SellerPaidOrdersPage';
import SellerRefundRequestPage from './pages/order/orderSeller/SellerRefundRequestsPage';
import SellerOrderHistoryPage from './pages/order/orderSeller/SellerOrderHistoryPage';
import AdminPage from './pages/admin/AdminPage';
import Cart from './pages/cart/Cart';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-seller" element={<RegisterSeller />} />
        <Route path="/register-shopper" element={<RegisterShopper />} />
        <Route path="/login" element={<Login />} />

        {/* admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* shopper */}
        <Route
          path="/home-shopper"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <HomeShopper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper-profile"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <ShopperProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/update-profile"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <UpdateShopperProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/change-email"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <ChangeShopperEmail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/change-password"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <ChangeShopperPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/cart"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/orders/pending"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <OrderPagePending />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/orders/shipping"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <OrderPageShipping />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/orders/delivered"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <OrderPageDelivered />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/orders/request-refunded"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <OrderPageRR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopper/order-history"
          element={
            <ProtectedRoute allowedRoles={['shopper']}>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />



        {/* seller */}

        <Route
          path="/home-seller"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-seller"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <ProductPageSeller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-product"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <CreateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-product/:id"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <UpdateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/update-profile"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/change-password"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <ChangeSellerPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/change-email"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <ChangeSellerEmail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders/pending"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerPendingOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders/paid"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerPaidOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders/request-refund"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerRefundRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/order-history"
          element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerOrderHistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
