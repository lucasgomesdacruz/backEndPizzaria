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
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
exports.default = {
    upload(folder) {
        // Se for rodar em ambiente read-only, força o uso de /tmp
        const destinationPath = folder === 'tmp' ? '/tmp' : (0, path_1.resolve)(__dirname, '..', '..', folder);
        return {
            storage: multer_1.default.diskStorage({
                destination: destinationPath,
                filename: (request, file, callback) => {
                    const fileHash = crypto_1.default.randomBytes(16).toString('hex');
                    const filename = `${fileHash}-${file.originalname}`;
                    callback(null, filename);
                }
            })
        };
    }
};
