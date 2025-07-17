import { SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'very_secret_key'
);

export async function encrypt(payload: Record<string, string> | string) {
  return await new SignJWT({ payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256']
  });
  return payload.payload;
}
