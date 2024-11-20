import { handleResponse } from "../lib/utils.js";
import UserSchema from "../models/user.model.js";
import MessageSchema from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await UserSchema.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    handleResponse(res, 200, true, "All users", filteredUsers);
  } catch (error) {
    return handleResponse(res, 500, false, "Internal Server Error", {
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  const { id: chatId } = req.params;

  try {
    const senderId = req.user._id;

    const messages = await MessageSchema.find({
      $or: [
        { fromId: senderId, toId: chatId },
        { fromId: chatId, toId: senderId },
      ],
    });
    handleResponse(res, 200, true, "All Messages", messages);
  } catch (error) {
    return handleResponse(res, 500, false, "Internal Server Error", {
      message: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  const { content, image } = req.body;
  const { id: toId } = req.params;

  try {
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }

    const newMessage = new MessageSchema({
      content,
      image: imageUrl,
      fromId: senderId,
      toId,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(toId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new-message", newMessage);
    }

    handleResponse(res, 201, true, "New message", newMessage);
  } catch (error) {
    console.log("Sending message error", error);
    return handleResponse(res, 500, false, "Internal Server Error", {
      message: error.message,
    });
  }
};
