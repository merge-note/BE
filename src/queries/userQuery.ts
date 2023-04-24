export const userQuery = {
  signupUser: "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
  authUser: "SELECT * FROM users WHERE email = ?",
  oAuthUser: "INSERT INTO users (email, name, picture) VALUES (?, ?, ?)",
  deleteUser: "DELETE FROM users WHERE id = ?",
  getUserById: `
  SELECT *
  FROM users
  WHERE id = ?
`,
};
