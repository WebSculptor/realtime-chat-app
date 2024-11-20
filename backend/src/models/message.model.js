import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const MessageSchema = mongoose.model("Message", messageSchema);
export default MessageSchema;
