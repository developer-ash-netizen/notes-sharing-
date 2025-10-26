import Note from '../models/Note.js';

export const uploadNote = async (req, res) => {
  try {
    const { title, description, subject, course, uploaderName, uploaderEmail } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const newNote = new Note({
      title,
      description,
      subject,
      course,
      uploaderName,
      uploaderEmail,
      fileURL: req.file.path,
      status: 'pending'
    });

    await newNote.save();

    res.status(201).json({
      message: 'Your notes were submitted for review.',
      note: newNote
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading note', error: error.message });
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
    const note = await Note.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

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
