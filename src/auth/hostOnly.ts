import createHttpError from "http-errors";

export const hostOnlyMiddleware = (req: any, res: any, next: any) => {
  if (req.user.role === "Host") {
    next();
  } else {
    next(createHttpError(403, "Hosts Only!"));
  }
};
