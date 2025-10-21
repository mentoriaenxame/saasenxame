// app/api/check-auth/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const isAuthenticated = cookies().has('crm-auth');
  
  return NextResponse.json({ 
    authenticated: isAuthenticated 
  });
}