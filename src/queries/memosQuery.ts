export const memosQuery = {
  getMemos:
    "SELECT * FROM memos WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",

  countTotalMemos: "SELECT COUNT(*) AS count FROM memos WHERE user_id = ?",

  getMemoById: `
  SELECT * FROM memos
  WHERE id = ? AND user_id = ?
  LIMIT 1
`,

  searchMemos: `
  SELECT *
  FROM memos
  WHERE user_id = ? AND (content LIKE ?) ORDER BY id DESC 
  LIMIT ? OFFSET ?;
`,

  countSearchMemos: `
  SELECT COUNT(*) AS count
  FROM memos
  WHERE user_id = ? AND (content LIKE ?);
`,
  addMemos:
    "INSERT INTO memos (user_id, content, created_at) VALUES (?, ?, now())",
  editMemos:
    "UPDATE memos SET content = ?, updated_at = now() WHERE id = ? AND user_id = ?",
  deleteMemos: "DELETE FROM memos WHERE id = ? AND user_id = ?",
};
