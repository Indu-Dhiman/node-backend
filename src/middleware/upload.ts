import util from "util";
import multer from "multer";
const maxSize = 200 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
        cb(null, "./upload");
    },
    filename: (req:any, file:any, cb:any) => {
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
export default uploadFileMiddleware;