import pool from "../config/db";
import { OkPacket, RowDataPacket } from "mysql2";
import { notesQuery } from "../queries/notesQuery";

interface Note {
  note_id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at?: Date;
}

interface CountRowData extends RowDataPacket {
  count?: number;
}

export const notesService = {
  getNotes: async (userId: number, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;
    const [rows] = await pool.query(notesQuery.getNotes, [
      userId,
      pageSize,
      offset,
    ]);

    const [totalCountRow] = await pool.query<CountRowData[]>(
      notesQuery.countTotalNotes,
      [userId]
    );

    return { notes: rows, totalCount: totalCountRow[0].count };
  },
  addNotes: async (
    userId: number,
    title: string,
    content: string,
    is_temp: boolean = true,
    is_pinned: boolean = false
  ) => {
    const [result] = await pool.query(notesQuery.addNotes, [
      userId,
      title,
      content,
      is_temp,
      is_pinned,
    ]);
    return (result as OkPacket).insertId;
  },
  editNotes: async (
    noteId: number,
    userId: number,
    title: string,
    content: string,
    is_pinned: boolean,
    is_temp: boolean = false
  ) => {
    const [result] = await pool.query(notesQuery.editNotes, [
      title,
      content,
      is_pinned,
      is_temp,
      noteId,
      userId,
    ]);
    if ((result as OkPacket).affectedRows === 0) {
      throw new Error("No note found to update");
    }
    return noteId;
  },
  deleteNotes: async (noteId: number, userId: number) => {
    const [result] = await pool.query(notesQuery.deleteNotes, [noteId, userId]);
    if ((result as OkPacket).affectedRows > 0) {
      return noteId;
    }
  },
};
