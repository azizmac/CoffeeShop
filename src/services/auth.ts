// JWT-like token service (simulates real JWT auth flow)
// In production, this would be handled by a real backend

const SECRET_KEY = 'brew-bean-secret-key-2024';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
  iat: number;
  exp: number;
}

// Base64 encode/decode helpers
function base64Encode(str: string): string {
  return btoa(encodeURIComponent(str));
}

function base64Decode(str: string): string {
  try {
    return decodeURIComponent(atob(str));
  } catch {
    return '';
  }
}

// Simple HMAC-like signature (for demo purposes)
function createSignature(header: string, payload: string): string {
  const data = header + '.' + payload + SECRET_KEY;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return base64Encode(Math.abs(hash).toString(36));
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + 86400 // 24 hours
  };
  const payloadEncoded = base64Encode(JSON.stringify(fullPayload));
  const signature = createSignature(header, payloadEncoded);
  return `${header}.${payloadEncoded}.${signature}`;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = createSignature(header, payload);
    
    if (signature !== expectedSignature) return null;

    const decoded: JWTPayload = JSON.parse(base64Decode(payload));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return null;

    return decoded;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem('brew_bean_token');
}

export function setToken(token: string): void {
  localStorage.setItem('brew_bean_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('brew_bean_token');
}

export function getCurrentUser(): JWTPayload | null {
  const token = getToken();
  if (!token) return null;
  return verifyToken(token);
}

export function isTokenExpired(): boolean {
  const user = getCurrentUser();
  if (!user) return true;
  const now = Math.floor(Date.now() / 1000);
  return user.exp < now;
}
