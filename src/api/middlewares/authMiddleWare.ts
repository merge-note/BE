import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: number;
}

export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Authorization header not found");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY!) as Record<
      string,
      any
    >;
    const userId = decoded.userId;
    req.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("Invalid token");
  }
};
