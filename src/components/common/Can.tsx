import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActionPermission } from '../../config/rbac';
import { UserRole } from '../../types';

interface CanProps {
  perform?: ActionPermission | ActionPermission[];
  role?: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({
  perform,
  role,
  children,
  fallback = null,
}) => {
  const { currentRole, can } = useApp();

  // Check role match if specified
  if (role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    if (!rolesArray.includes(currentRole)) {
      return <>{fallback}</>;
    }
  }

  // Check permission match if specified
  if (perform) {
    const permissionsArray = Array.isArray(perform) ? perform : [perform];
    const hasAll = permissionsArray.every((perm) => can(perm));
    if (!hasAll) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

