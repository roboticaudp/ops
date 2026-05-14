'use client';

import { useState } from 'react';
import { Card, Typography, Button, Alert, AlertTitle, AlertDescription, Badge, Skeleton } from '@/components/ui';
import { Trash2, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useAllowedUsers } from '@/lib/hooks/useAllowedUsers';

export default function SettingsUsersPage() {
  const { users, loading, error, adding, addUser, removeUser } = useAllowedUsers();
  const [newEmail, setNewEmail] = useState('');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addUser(newEmail);
    if (success) setNewEmail('');
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton variant="header" />
        <Skeleton variant="list" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">

      {error && (
        <Alert variant="error">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Typography as="p" emphasis="medium" className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              Añadir Nuevo Usuario
            </Typography>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 focus:outline-none focus:border-blue-500/50 transition-all"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={adding}
            className="h-[50px] px-8 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-tighter"
          >
            {adding ? 'Añadiendo...' : 'Autorizar Acceso'}
          </Button>
        </form>
      </Card>

      <div className="grid gap-3">
        <div className="flex items-center justify-end gap-2">
          <Badge color="blue">
            {users.length} Usuarios
          </Badge>
        </div>
        {users.map((user) => (
          <div
            key={user.email}
            className="group flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <div>
                <Typography as="p" className="font-bold text-zinc-100">
                  {user.email}
                </Typography>
                <Typography as="p" emphasis="medium" className="text-[10px] text-zinc-500">
                  Autorizado el {new Date(user.created_at).toLocaleDateString()}
                </Typography>
              </div>
            </div>

            <button
              onClick={() => removeUser(user.email)}
              className="p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
              title="Eliminar acceso"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        {users.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
            <UserPlus className="mx-auto text-zinc-700 mb-4" size={48} />
            <Typography as="p" emphasis="medium" className="text-zinc-500">
              No hay usuarios autorizados todavía.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
