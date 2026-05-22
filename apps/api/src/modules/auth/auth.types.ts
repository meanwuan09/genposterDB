export type Role = 'admin' | 'staff';

export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  role: Role;
};

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};
