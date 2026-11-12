export interface User {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
}

export interface UserSignUp {
  id?: number;
  login: string;
  password?: string;
  confirmPassword?: string;
  nom: string;
  prenom: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}
