import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../app/store';
import Modal from '../components/modal/modal_notification'; // Import modal

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];  // Role yang diizinkan
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { token, user } = useSelector((state: RootState) => state.auth); // Mengambil token dan user dari auth state
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [redirect, setRedirect] = useState(false); // State untuk redirect setelah modal tampil

  useEffect(() => {
    const userRole = user?.role || ''; // Ambil role dari user jika ada
    if (!token || !allowedRoles.includes(userRole)) {
      setShowModal(true); // Tampilkan modal ketika tidak diizinkan mengakses halaman

      // Setelah 3 detik, sembunyikan modal dan redirect ke halaman login
      const timer = setTimeout(() => {
        setShowModal(false);
        setRedirect(true); // Set redirect setelah modal ditutup
      }, 3000);

      // Cleanup function untuk menghindari memory leaks
      return () => clearTimeout(timer);
    }
  }, [token, user?.role, allowedRoles]);

  const handleCloseModal = () => {
    setShowModal(false); // Fungsi untuk menutup modal
    setRedirect(true); // Redirect setelah modal ditutup
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Modal
        message="You have to login to access this page." // Pesan yang akan ditampilkan di modal
        show={showModal}
        onClose={handleCloseModal}
      />
      {token && children} {/* Hanya render children jika token ada */}
    </>
  );
};

export default ProtectedRoute;
