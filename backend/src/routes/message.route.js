import { Router } from "express";
import { protectedRoute } from "../middleware/auth.moddleware.js";
import {
  getAllUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const route = Router();

route.get("/users", protectedRoute, getAllUsers);
route.get("/:id", protectedRoute, getMessages);

route.post("/send/:id", protectedRoute, sendMessage);

export default route;
