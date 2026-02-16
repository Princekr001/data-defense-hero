import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const schema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-reset-email', {
        body: {
          email: data.email,
          redirectTo: `${window.location.origin}/reset-password`,
        },
      });

      if (error) {
        toast({ title: 'Error', description: 'Failed to send reset email. Please try again.', variant: 'destructive' });
      } else {
        setSent(true);
      }
    } catch {
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <Mail className="h-12 w-12 mx-auto text-primary" />
        <h3 className="font-semibold text-lg">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          If an account exists with that email, we've sent a password reset link.
        </p>
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 -ml-2 mb-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <p className="text-sm text-muted-foreground">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="agent@ciphercity.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" variant="cyber" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
            ) : (
              <><Mail className="mr-2 h-4 w-4" /> Send Reset Link</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
