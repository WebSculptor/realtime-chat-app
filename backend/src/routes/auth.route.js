import { Router } from "express";
import {
  signInFn,
  signOutFn,
  signUpFn,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.moddleware.js";

const route = Router();

route.post("/sign-up", signUpFn);
route.post("/sign-in", signInFn);
route.post("/sign-out", signOutFn);

route.put("/avatar", protectedRoute, updateProfile);

route.get("/check", protectedRoute, checkAuth);

export default route;
