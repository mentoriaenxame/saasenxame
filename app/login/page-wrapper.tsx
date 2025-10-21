// app/login/page-wrapper.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default function LoginPageWrapper() {
  // Check if user is already logged in and redirect to dashboard
  const isAuthenticated = cookies().has("crm-auth");
  if (isAuthenticated) {
    redirect("/");
  }

  return <LoginForm />;
}
