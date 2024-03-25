// Generate a random token
export default function generateToken() {
  return Math.random().toString(36).substr(2, 10);
}
