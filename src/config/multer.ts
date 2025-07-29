// import crypto from 'crypto'
// import multer from 'multer'

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

import multer from 'multer';

export default {
  upload() {
    return {
      storage: multer.memoryStorage(), // 🔥 armazena o arquivo em memória
    };
  }
};
