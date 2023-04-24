import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./api/routes/userRoutes";
import memosRoutes from "./api/routes/memosRoutes";
import noteRoutes from "./api/routes/notesRoutes";
import { authMiddleware } from "./api/middlewares/authMiddleWare";

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //특문, 공백

// api별 router 연결
app.use("/user", userRoutes);
app.use("/memos", authMiddleware, memosRoutes);
app.use("/notes", authMiddleware, noteRoutes);

export default app;
