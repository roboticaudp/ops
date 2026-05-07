'use client';

import { LogOut, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { Avatar, Typography, Skeleton, DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui';
import { AuthService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Skeleton variant="user" />;
  }

  if (!user) return null;

  const handleLogout = async () => {
    await AuthService.signOut();
    router.push('/login');
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <Typography as="p" className="text-sm uppercase">
          {user.user_metadata?.full_name || 'Usuario'}
        </Typography>
        <Typography as="p" emphasis="medium" className="text-xs">
          {user.email}
        </Typography>
      </div>
      <div className="relative group">
        <Avatar
          src={user.user_metadata?.avatar_url}
          name={user.user_metadata?.full_name || user.email}
          className="cursor-pointer h-8 w-8"
        />

        <DropdownMenu>
          <DropdownMenuItem
            icon={LogOut}
            variant="danger"
            onClick={handleLogout}
          >
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}
