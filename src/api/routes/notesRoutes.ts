import { Router } from "express";
import { noteController } from "../controllers/notesController";

const noteRoutes = Router();

//User API routes
noteRoutes.post("/", noteController.addNotes);
noteRoutes.get("/", noteController.getNotes);
noteRoutes.put("/:id", noteController.editNotes);
noteRoutes.delete("/:id", noteController.deleteNotes);

export default noteRoutes;
