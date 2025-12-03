import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hubivent_secret_key_change_in_production";
const JWT_EXPIRE = "7d";

export function generateToken(user) {
  const payload = {
    id: user.id,   // 🔥 penting: gunakan userId sebagai key
    email: user.email,
    username: user.username,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: "hubivent_api"
  });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
