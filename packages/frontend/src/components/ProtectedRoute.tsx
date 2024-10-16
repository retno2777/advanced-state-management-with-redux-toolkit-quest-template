import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';
import Modal from '../components/modal/modal_notification';
/**
 * ProtectedRoute component
 * This component is used to protect routes based on user roles
 * When user is not logged in or user role is not allowed, it will redirect to login page
 * and show a modal notification
 */
interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const userRole = user?.role || '';
    if (!token || !allowedRoles.includes(userRole)) {
      setShowModal(true);


      const timer = setTimeout(() => {
        setShowModal(false);
        setRedirect(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [token, user?.role, allowedRoles]);

  const handleCloseModal = () => {
    setShowModal(false);
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Modal
        message="You have to login to access this page."
        show={showModal}
        onClose={handleCloseModal}
      />
      {token && children}
    </>
  );
};

export default ProtectedRoute;
