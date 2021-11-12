import express from "express";
import createHttpError from "http-errors";

import UserSchema from "./schema.js";
import { JWTAuthenticate } from "../auth/tools";
import AccomodationSchema from "../accomodation/schema";
import { JWTAuthMiddleware } from "../auth/token";
import { hostOnlyMiddleware } from "../auth/hostOnly";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserSchema.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserSchema(req.body);
    const { _id } = await newUser.save();
    const accessToken = await JWTAuthenticate(newUser);
    res.send({ ...newUser.toObject(), accessToken });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserSchema.checkCredentials(email, password);

    if (user) {
      const accessToken = await JWTAuthenticate(user);

      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/me/accomodation",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req:any , res, next) => {
    try {
      console.log(req.user._id.toString());
      const accomodations = await AccomodationSchema.find({
        host: req.user._id.toString(),
      });

      res.status(200).send(accomodations);
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/me", JWTAuthMiddleware, async (req:any, res, next) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
