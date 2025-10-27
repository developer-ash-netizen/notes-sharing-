// backend/routes/noteRoutes.js
import express from 'express';
import multer from 'multer';
import {
  uploadNote,
  getApprovedNotes,
  getPendingNotes,
  approveNote,
  deleteNote
} from '../controllers/noteController.js';

const router = express.Router();

// ✅ Multer will temporarily store files in /uploads before sending to Google Drive
const upload = multer({ dest: 'uploads/' });

// ✅ Upload route (Google Drive replaces Cloudinary here)
router.post('/upload', upload.single('file'), uploadNote);

// Other routes remain the same
router.get('/', getApprovedNotes);
router.get('/pending', getPendingNotes);
router.patch('/approve/:id', approveNote);
router.delete('/:id', deleteNote);

export default router;
