'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { Avatar, Skeleton, DropMenu, DropMenuItem, Profile } from '@/components/ui';
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
    <div className="relative group">
      <Profile
        reverse
        className="cursor-pointer"
        avatar={
          <Avatar
            src={user.user_metadata?.avatar_url}
            name={user.user_metadata?.full_name || user.email}
            className="h-8 w-8"
          />
        }
        title={user.user_metadata?.full_name || 'Usuario'}
        description={user.email}
        titleClassName="uppercase text-xs"
      />

      <DropMenu>
        <DropMenuItem
          icon={LogOut}
          variant="danger"
          onClick={handleLogout}
        >
          Cerrar sesión
        </DropMenuItem>
      </DropMenu>
    </div>
  );
}
