import { Request } from "express";

interface CustomRequest extends Request {
  token?: string;
  currentUser?: {
    id: number;
    email: string;
    name: string;
    type: string;
  };
}
