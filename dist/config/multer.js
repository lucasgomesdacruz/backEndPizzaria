"use strict";
// import crypto from 'crypto'
// import multer from 'multer'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { extname, resolve } from 'path'
// export default {
//     upload(folder: string) {
//         return {
//             storage: multer.diskStorage({
//                 destination: resolve(__dirname, '..', '..', folder),
//                 filename: (request, file, callback) => {
//                     const fileHash = crypto.randomBytes(16).toString('hex');
//                     const filename = `${fileHash}-${file.originalname}`
//                     return callback(null, filename)
//                 }
//             })
//         }
//     }
// }
const multer_1 = __importDefault(require("multer"));
exports.default = {
    upload() {
        return {
            storage: multer_1.default.memoryStorage(), // 🔥 armazena o arquivo em memória
        };
    }
};
