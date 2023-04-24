import { Router } from "express";
import { memosController } from "../controllers/memosController";

const memosRoutes = Router();

// // User API routes
memosRoutes.post("/", memosController.addMemos);
memosRoutes.get("/", memosController.getMemos);
memosRoutes.get("/search", memosController.searchMemos);
memosRoutes.get("/:id", memosController.getMemoById);
memosRoutes.put("/:id", memosController.editMemos);
memosRoutes.delete("/:id", memosController.deleteMemos);

export default memosRoutes;
