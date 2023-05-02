export const notesQuery = {
  getNotes:
    "SELECT * FROM notes WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
  countTotalNotes: "SELECT COUNT(*) AS count FROM notes WHERE user_id = ?",
  addNotes:
    "INSERT INTO notes (user_id, title, content, is_temp, is_pinned, created_at) VALUES (?, ?, ?, ?, ?, now())",
  editNotes:
    "UPDATE notes SET title = ?, content = ?, is_pinned = ?, is_temp = ?, updated_at = now() WHERE id = ? AND user_id = ?",
  deleteNotes: "DELETE FROM notes WHERE id = ? AND user_id = ?",
};
