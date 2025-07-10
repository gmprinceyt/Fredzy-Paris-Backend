import multer from "multer";
import { v4 as uuid } from 'uuid';
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'uploads');
    },
    filename(req, file, callback) {
        const ext = file.originalname.split('.').pop();
        callback(null, `${uuid()}.${ext}`);
    },
});
export const singleUpload = multer({ storage }).single('photo');
