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

  /** Optimistic add: agrega al estado local inmediatamente, luego persiste en DB */
  const addUser = async (email: string) => {
    try {
      setError(null);
      const validated = allowedUserSchema.parse({ email });
      setAdding(true);

      // 1. Agregar optimistamente con datos temporales
      const optimisticUser = {
        email: validated.email,
        created_at: new Date().toISOString(),
        _temp: true,
      };
      setUsers(prev => [optimisticUser, ...prev]);

      // 2. Persistir en DB
      const created = await AuthService.addAllowedUser(validated.email);

      // 3. Reemplazar item temporal con el real
      setUsers(prev => prev.map(u =>
        u._temp && u.email === validated.email ? created : u
      ));

      return true;
    } catch (err: any) {
      // Rollback: quitar el item temporal
      setUsers(prev => prev.filter(u => !(u._temp && u.email === email)));
      setError(err.message);
      return false;
    } finally {
      setAdding(false);
    }
  };

  /** Optimistic remove: quita del estado local inmediatamente, luego persiste en DB */
  const removeUser = async (email: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${email}?`)) return;

    // 1. Snapshot para rollback
    const snapshot = users;

    // 2. Quitar optimistamente
    setUsers(prev => prev.filter(u => u.email !== email));

    try {
      setError(null);
      // 3. Persistir en DB
      await AuthService.removeAllowedUser(email);
    } catch (err: any) {
      // 4. Rollback al snapshot original
      setUsers(snapshot);
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

