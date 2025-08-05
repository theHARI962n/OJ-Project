import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Redirect to login if not authenticated or not admin
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children; // Allow access
}
