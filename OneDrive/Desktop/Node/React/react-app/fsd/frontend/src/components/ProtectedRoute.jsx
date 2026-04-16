import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ roles }) => {
  const { userInfo, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userInfo.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
