// backend/config/googleDrive.js
import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const KEYFILEPATH = path.join(process.cwd(), 'backend', 'config', 'credentials.json');

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

export default drive;
