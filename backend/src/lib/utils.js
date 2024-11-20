import jwt from "jsonwebtoken";

export const genJWTToken = (userId, res) => {
  // 1. Create a payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // 2. Send the token back to the client cookie
  res.cookie("jwt_token", token, {
    httpOnly: true, // prevent cross-site scripting attacks and client-side JS from accessing the cookie
    sameSite: "strict", // prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    secure: process.env.NODE_ENV !== "development", // only send the cookie over HTTPS
  });

  // 3. Return the token to the client
  return token;
};

export const handleResponse = (
  res,
  statusCode,
  success,
  message,
  result = null,
  error = null
) => {
  if (!success && error) {
    console.log(`[Error - ${statusCode}]:`, error.message || error);
  }

  return res.status(statusCode).json({
    success,
    message,
    ...(result && { result }),
  });
};
