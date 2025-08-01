import { MediaType } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { extname } from 'path';

export const multerConfig = {
  dest: path.join(process.cwd(), 'uploads'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req: Request, file, cb) => {
    const type = req.params.type as MediaType;
    let allowedMimeTypes: string[] = [];
    switch (type) {
      case MediaType.HEADER_LOGO:
      case MediaType.TERMS_LOGO:
      case MediaType.SPONSORS_LOGOS:
        allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/svg+xml',
          'image/webp',
        ];
        break;
      case MediaType.LANDING_VIDEO:
        allowedMimeTypes = ['video/mp4', 'video/webm'];
        break;
      case MediaType.START_AUDIO:
      case MediaType.END_AUDIO:
        allowedMimeTypes = [
          'audio/mpeg', // MP3
          'audio/wav',
          'audio/ogg',
          'audio/webm',
          'audio/aac',
          'audio/m4a',
          'audio/x-m4a',
        ];
        break;
    }

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type for ${type}. Only ${allowedMimeTypes.join(
            ', ',
          )} are allowed.`,
        ),
      );
    }
  },
  storage: diskStorage({
    destination: path.join(process.cwd(), 'uploads'),
    filename: (_, file, cb) => {
      const ext = extname(file.originalname);
      const unique = `${randomUUID()}${ext}`;
      cb(null, unique);
    },
  }),
};
