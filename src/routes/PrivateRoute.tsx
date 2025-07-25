import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { eventPath } from '@/routes/eventPath';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // lub spinner

    return user ? <Outlet /> : <Navigate to={eventPath.login.path} replace />;
};

export default PrivateRoute;