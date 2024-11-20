import bcrypt from "bcryptjs";
import UserSchema from "../models/user.model.js";
import { genJWTToken, handleResponse } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signUpFn = async (req, res) => {
  const { fName, email, password } = req.body;

  try {
    if (!fName || !email || !password)
      return handleResponse(res, 400, false, "Please fill in all fields");

    // 1. Check if password length is less than 6 characters
    if (password.length < 6)
      return handleResponse(
        res,
        400,
        false,
        "Password must be at least 6 characters"
      );

    // 2. Check if the email already exists in the database
    const user = await UserSchema.findOne({ email });
    if (user) return handleResponse(res, 400, false, "Email already exists");

    // 3. Hash users password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create a new user
    const newUser = new UserSchema({
      fName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // 5. Generate a JWT token
      genJWTToken(newUser._id, res);
      await newUser.save();

      // 6. Return a success message
      return handleResponse(res, 201, true, "Account created successfully", {
        _id: newUser._id,
        fName: newUser.fName,
        email: newUser.email,
        avatar: newUser.avatar,
      });
    } else {
      return handleResponse(res, 400, false, "Failed to create user");
    }
  } catch (error) {
    handleResponse(res, 500, false, "Internal Server Error", {
      message: error.message,
    });
  }
};

export const signInFn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the email already exists in the database
    const user = await UserSchema.findOne({ email });
    if (!user) return handleResponse(res, 400, false, "Invalid credentials");

    // 2. Make a comparison between the password and the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return handleResponse(res, 400, false, "Invalid credentials");

    // 3. Generate a JWT token
    genJWTToken(user._id, res);

    // 4. Return the user data
    return handleResponse(res, 201, true, "Logged in successfully", {
      _id: user._id,
      email: user.email,
      fName: user.fName,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    handleResponse(res, 500, false, "Internal Server Error", {
      message: error.message,
    });
  }
};

export const signOutFn = (req, res) => {
  try {
    res.cookie("jwt_token", "", { maxAge: 0 });
    return handleResponse(res, 201, true, "Logged out successfully");
  } catch (error) {
    handleResponse(res, 500, false, "Internal Server Error", {
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  const { avatar } = req.body;

  try {
    if (!avatar) {
      return handleResponse(res, 400, false, "Avatar is required");
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (Buffer.byteLength(avatar, "utf8") > MAX_SIZE) {
      return handleResponse(res, 400, false, "Avatar exceeds the allowed size");
    }

    const userId = req.user._id;
    const response = await cloudinary.uploader.upload(avatar);

    const updatedUser = await UserSchema.findByIdAndUpdate(
      userId,
      { avatar: response.secure_url },
      { new: true }
    );

    return handleResponse(
      res,
      201,
      true,
      "Profile updated successfully",
      updatedUser
    );
  } catch (error) {
    console.error("[UPLOAD ERROR]:", error.message);
    handleResponse(res, 500, false, "Internal Server Error", {
      message: error.message,
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    handleResponse(res, 200, true, "Authenticated user", req.user);
  } catch (error) {
    handleResponse(res, 500, false, "Error im checkAuth controller", {
      message: error.message,
    });
  }
};
