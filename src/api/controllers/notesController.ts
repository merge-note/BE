import { Request, Response } from "express";
import { notesService } from "../../services/notesService";

interface CustomRequest extends Request {
  userId?: number;
}

export const noteController = {
  getNotes: async (req: CustomRequest, res: Response) => {
    try {
      const page = req.query.page ? +req.query.page : 1;
      const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
      const userId = req.userId!;
      const notes = await notesService.getNotes(userId, page, pageSize);
      res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  addNotes: async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId!;
      const { title, content } = req.body;
      const newNote = await notesService.addNotes(userId, title, content);
      res.status(201).json({ message: `Added noteId is ${newNote}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  editNotes: async (req: CustomRequest, res: Response) => {
    try {
      const { title, content } = req.body;
      const noteId = Number(req.params.id);
      const userId = req.userId!;
      await notesService.editNotes(noteId, userId, title, content);
      res.status(200).json({ noteId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteNotes: async (req: CustomRequest, res: Response) => {
    const noteId = Number(req.params.id);
    const userId = req.userId!;

    const result = await notesService.deleteNotes(noteId, userId);

    if (!result) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(201).json({ message: `Deleted NoteId is ${result}` });
  },
};
