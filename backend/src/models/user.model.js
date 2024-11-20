import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fName: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model("User", userSchema);
export default UserSchema;