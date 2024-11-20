import jwt from "jsonwebtoken";
import UserSchema from "../models/user.model.js";
import { handleResponse } from "../lib/utils.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await UserSchema.findById(decoded.userId).select("-password");
    if (!user) return handleResponse(res, 404, "User not found");

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: "Unauthorized - Invalid token" });
  }
};
