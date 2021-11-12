import { Model } from "mongoose";

export interface UserModel {
  _id: string
  email: string
  password: string
  role: string
}

export interface UserSchemaType extends Model<UserModel> {
  checkCredentials(email: string, password: string): any;
}

export interface UserType {
  _id: string;
}