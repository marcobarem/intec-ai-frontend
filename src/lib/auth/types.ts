export interface BackendUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthorizedUser extends BackendUser {
  accessToken: string;
}

export interface CustomJWT {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  jti?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
}

export interface CustomSession {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  expires: string;
}
