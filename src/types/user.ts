export interface IUser {
    _id?: string;
    userName: string;
    email: string;
    password: string;
    numberPhone: string;
    address: string;
    gender: string;
    avt:string;
    role:UserRole
  }
  export enum UserRole {
    // khách vãng lai
    GUEST = "guest",
    // Người dùng
    REGULAR_USER = "regular_user",
    // Admin
    ADMIN = "admin",
  }