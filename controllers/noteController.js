// backend/controllers/noteController.js
import fs from 'fs';
import drive from '../config/googleDrive.js';
import Note from '../models/Note.js';

export const uploadNote = async (req, res) => {
  try {
    const { title, description, subject, course, uploaderName, uploaderEmail } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // 1️⃣ Upload to Google Drive
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webViewLink, webContentLink',
    });

    // 2️⃣ Make file public
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 3️⃣ Delete local copy
    fs.unlinkSync(req.file.path);

    // 4️⃣ Save to MongoDB
    const newNote = new Note({
      title,
      description,
      subject,
      course,
      uploaderName,
      uploaderEmail,
      fileURL: file.data.webViewLink,
      status: 'pending',
      uploadedAt: new Date(),
    });

    await newNote.save();

    res.status(201).json({
      message: 'Your notes were submitted for review.',
      note: newNote,
    });
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    res.status(500).json({
      message: 'Error uploading note',
      error: error.message,
    });
  }
};

export const getApprovedNotes = async (req, res) => {
  try {
    const notes = await Note.find({ status: 'approved' }).sort({ uploadedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
};

export const getPendingNotes = async (req, res) => {
  try {
    const notes = await Note.find({ status: 'pending' }).sort({ uploadedAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending notes', error: error.message });
  }
};

export const approveNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndUpdate(id, { status: 'approved' }, { new: true });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note approved successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Error approving note', error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};
