import express from 'express';
import { upload } from '../config/cloudinary.js';
import {
  uploadNote,
  getApprovedNotes,
  getPendingNotes,
  approveNote,
  deleteNote
} from '../controllers/noteController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadNote);
router.get('/', getApprovedNotes);
router.get('/pending', getPendingNotes);
router.patch('/approve/:id', approveNote);
router.delete('/:id', deleteNote);

export default router;
