import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../lib/stores';

/**
 * Component that automatically redirects users to their role-specific dashboard
 */
const RoleBasedRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.roles && user.roles.length > 0) {
      // Get the primary role (first one or highest priority)
      const primaryRole = getPrimaryRole(user.roles);
      
      switch (primaryRole.toLowerCase()) {
        case 'hr':
        case 'admin':
          navigate('/employee-evaluation/hr', { replace: true });
          break;
        case 'manager':
          navigate('/employee-evaluation/leader', { replace: true });
          break;
        case 'employee':
        default:
          navigate('/employee-evaluation/worker', { replace: true });
          break;
      }
    } else {
      // Fallback to worker panel if no roles found
      navigate('/employee-evaluation/worker', { replace: true });
    }
  }, [user, navigate]);

  // Loading state while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <div>Przekierowanie do odpowiedniego panelu...</div>
    </div>
  );
};

/**
 * Determines the primary role based on hierarchy
 * Priority: Admin > HR > Manager > Employee
 */
function getPrimaryRole(roles: string[]): string {
  const roleHierarchy = ['admin', 'hr', 'manager', 'employee'];
  
  for (const role of roleHierarchy) {
    if (roles.some(userRole => userRole.toLowerCase() === role)) {
      return role;
    }
  }
  
  // Default to employee if no recognized role found
  return 'employee';
}

export default RoleBasedRedirect;
