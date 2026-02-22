import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const getSecret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? 'greenamy-super-secret-jwt-key-2024'
  );

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('greenamy_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
