import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Shield, Cloud, CloudOff } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function UserAuthButton() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, profile, isAuthenticated, loading, signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Signed out',
        description: 'Your progress is saved locally. Sign in to sync across devices.',
      });
    }
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'P';
  };

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setAuthModalOpen(true)}
          className="gap-2"
        >
          <CloudOff className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline">Sign In</span>
          <span className="sm:hidden">Login</span>
        </Button>
        <AuthModal
          open={authModalOpen}
          onOpenChange={setAuthModalOpen}
          onSignIn={signIn}
          onSignUp={signUp}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 pl-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/20 text-xs">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline max-w-[100px] truncate">
            {profile?.display_name || user?.email?.split('@')[0] || 'Player'}
          </span>
          <Cloud className="h-4 w-4 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <div className="flex flex-col">
            <span className="font-medium">{profile?.display_name || 'Agent'}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
          <Cloud className="mr-2 h-4 w-4 text-primary" />
          Cloud sync active
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
