import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userQuery } from "../queries/userQuery";

const saltRounds = 10;

type UserRow = {
  id: number;
  email: string;
  password: string;
};

export const userService = {
  signupUser: async (email: string, name: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [rows] = await pool.query(userQuery.signupUser, [
      email,
      name,
      hashedPassword,
    ]);
    return rows;
  },

  authUser: async (email: string, password: string) => {
    const [rows] = await pool.query<UserRow[] & RowDataPacket[]>(
      userQuery.authUser,
      [email]
    );
    if (!rows || rows.length === 0) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRETKEY!);

    return {
      token,
      name: rows[0].name,
      picture: rows[0].picture,
    };
  },

  authUserWithOAuth: async (userData: any) => {
    const [rows] = await pool.query<UserRow[] & RowDataPacket[]>(
      userQuery.authUser,
      [userData.email]
    );

    let user;
    if (!rows || rows.length === 0) {
      // 사용자가 없으면 새 사용자 생성
      const [insertResult] = await pool.query<OkPacket>(userQuery.oAuthUser, [
        userData.email,
        userData.name,
        userData.picture,
      ]);

      user = {
        id: insertResult.insertId,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      };
    } else {
      user = rows[0];
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRETKEY!);

    return {
      token,
      name: user.name,
      picture: user.picture,
    };
  },

  deleteUser: async (userId: number) => {
    const [result] = await pool.query(userQuery.deleteUser, [userId]);
    if ((result as OkPacket).affectedRows > 0) {
      return true;
    }
    return false;
  },
};
