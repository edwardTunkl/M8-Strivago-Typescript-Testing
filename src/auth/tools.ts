import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {UserType} from "../types/types"

process.env.TS_NODE_DEV && require("dotenv").config()

if (!process.env.JWT_SECRET) {
  throw new Error("No MongoDB uri defined")
}

export const JWTAuthenticate = async (user: UserType) => {
  const accessToken = await generateJWT({ _id: user._id });

  return accessToken;
};

const generateJWT = (payload: {_id:string}) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      }
    )
  );

export const verifyJWT = (token:string) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) rej(err);
      else res(decodedToken);
    })
  );
