// Guards a route so only a logged-in user (optionally of a specific role)
// can see it. Reads auth state from AuthContext instead of localStorage
// directly, so it always agrees with what the rest of the app sees.
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";

export default function PrivateRoute({ children, roleRequired }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // While we're still checking localStorage for an existing token, show a
  // spinner instead of redirecting - otherwise a logged-in user gets
  // bounced to /login for a split second on every page refresh.
  if (loading) {
    return <LoadingState label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
}
