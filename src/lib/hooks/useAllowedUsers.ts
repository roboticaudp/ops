import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '@/services/auth.service';
import { allowedUserSchema } from '@/lib/validations';

export function useAllowedUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AuthService.getAllAllowedUsers();
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = async (email: string) => {
    try {
      setError(null);
      const validated = allowedUserSchema.parse({ email });
      setAdding(true);
      await AuthService.addAllowedUser(validated.email);
      await loadUsers();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setAdding(false);
    }
  };

  const removeUser = async (email: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${email}?`)) return;
    
    try {
      setError(null);
      await AuthService.removeAllowedUser(email);
      await loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return {
    users,
    loading,
    error,
    adding,
    addUser,
    removeUser,
    refresh: loadUsers
  };
}
