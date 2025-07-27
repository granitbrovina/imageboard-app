import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { unstable_noStore as noStore } from 'next/cache';

export interface UserPayload {
  id: number;
  username: string;
  role: string;
}

// Type guard to check if an object is UserPayload
function isUserPayload(payload: unknown): payload is UserPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'id' in payload &&
    typeof (payload as any).id === 'number' &&
    'username' in payload &&
    typeof (payload as any).username === 'string' &&
    'role' in payload &&
    typeof (payload as any).role === 'string'
  );
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getCurrentUser(): Promise<UserPayload | null> {
  noStore();

  const token = (await cookies()).get('auth_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (isUserPayload(payload)) {
      return payload; // TypeScript now knows payload is UserPayload
    }
    return null;
  } catch (error) {
    return null;
  }
}