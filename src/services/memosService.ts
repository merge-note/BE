import pool from "../config/db";
import { OkPacket, RowDataPacket } from "mysql2";
import { memosQuery } from "../queries/memosQuery";

interface Memo {
  memo_id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at?: Date;
}

interface CountRowData extends RowDataPacket {
  count?: number;
}

export const memosService = {
  getMemos: async (userId: number, page: number, pageSize: number) => {
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.query(memosQuery.getMemos, [
      userId,
      pageSize,
      offset,
    ]);

    const [totalCountRow] = await pool.query<CountRowData[]>(
      memosQuery.countTotalMemos,
      [userId]
    );

    //배열 내에 아무것도 없으면 undefinde return 막기 위함.
    const totalCount = totalCountRow[0]?.count ?? 0;
    //pageCount가 1보다 작으면 1을 return.
    const pageCount = Math.max(Math.ceil(totalCount / pageSize), 1);

    return { memos: rows, totalCount: totalCount, pageCount: pageCount };
  },

  getMemoById: async (memoId: number, userId: number): Promise<Memo | null> => {
    const [rows] = await pool.query(memosQuery.getMemoById, [memoId, userId]);
    const memos = rows as Memo[];

    return memos.length ? memos[0] : null;
  },

  searchMemos: async (
    userId: number,
    searchQuery: string,
    page: number,
    pageSize: number
  ) => {
    const offset = (page - 1) * pageSize;
    const searchTerm = `%${searchQuery}%`;
    const [rows] = await pool.query(memosQuery.searchMemos, [
      userId,
      searchTerm,
      searchTerm,
      pageSize,
      offset,
    ]);

    const [totalCountRow] = await pool.query<CountRowData[]>(
      memosQuery.countSearchMemos,
      [userId, searchTerm, searchTerm]
    );

    //배열 내에 아무것도 없으면 undefinde return 막기 위함.
    const totalCount = totalCountRow[0]?.count ?? 0;
    //pageCount가 1보다 작으면 1을 return.
    const pageCount = Math.max(Math.ceil(totalCount / pageSize), 1);

    return {
      memos: rows,
      totalCount: totalCount,
      pageCount: pageCount,
    };
  },

  addMemos: async (userId: number, title: string, content: string) => {
    const [result] = await pool.query(memosQuery.addMemos, [
      userId,
      title,
      content,
    ]);
    return (result as OkPacket).insertId;
  },

  editMemos: async (
    memoId: number,
    userId: number,
    title: string,
    content: string
  ) => {
    const [result] = await pool.query(memosQuery.editMemos, [
      title,
      content,
      memoId,
      userId,
    ]);
    if ((result as OkPacket).affectedRows === 0) {
      throw new Error("No memo found to update");
    }
    return memoId;
  },

  deleteMemos: async (memoId: number, userId: number) => {
    const [result] = await pool.query(memosQuery.deleteMemos, [memoId, userId]);
    if ((result as OkPacket).affectedRows > 0) {
      return memoId;
    }
  },
};
