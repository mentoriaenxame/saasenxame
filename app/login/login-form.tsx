// app/login/login-form.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction, type LoginState } from "@/lib/auth-actions";
import { User, Lock } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      className="w-full" 
      type="submit"
      disabled={pending}
    >
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

const initialState: LoginState = { success: false, message: "", user: null };

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);
  const router = useRouter();

  // Redirect to the main dashboard after a successful login
  useEffect(() => {
    if (state?.success) {
      // Add a small delay to ensure state updates properly
      const timer = setTimeout(() => {
        router.push("/");
        router.refresh(); // Refresh to update the UI with the authenticated state
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Acesso ao CRM</CardTitle>
          <CardDescription className="text-center">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            {!state.success && state.message && (
              <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                {state.message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="seu@email.com" 
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
