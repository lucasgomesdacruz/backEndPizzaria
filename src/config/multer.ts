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

import crypto from 'crypto'
import multer from 'multer'
import { extname, resolve } from 'path'

export default {
  upload(folder: string) {
    // Se for rodar em ambiente read-only, força o uso de /tmp
    const destinationPath = folder === 'tmp' ? '/tmp' : resolve(__dirname, '..', '..', folder)

    return {
      storage: multer.diskStorage({
        destination: destinationPath,
        filename: (request, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString('hex')
          const filename = `${fileHash}-${file.originalname}`
          callback(null, filename)
        }
      })
    }
  }
}
