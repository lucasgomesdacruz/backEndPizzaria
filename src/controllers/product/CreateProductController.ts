// import { Request, Response } from "express";
// import { CreateProductService } from "../../services/product/CreateProductService";
// import { UploadedFile } from "express-fileupload";

// import { v2 as cloudinary, UploadApiResponse } from "cloudinary"

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET
// })

// class CreateProductController {
//     async handle(req: Request, res: Response) {
//         const { name, price, description, category_id } = req.body
        
//         const createProductService = new CreateProductService();

//         if(!req.files || Object.keys(req.files).length === 0) {
//             throw new Error("error upload file")
//         } else {
//             const file: UploadedFile = req.files['file']

//             const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
//                 cloudinary.uploader.upload_stream({}, function (error, result) {
//                     if(error){
//                         reject(error);
//                         return
//                     }

//                     resolve(result)
//                 }).end(file.data)

//             })

//             const product = await createProductService.execute({
//                 name,
//                 price,
//                 description,
//                 banner: resultFile.url,
//                 category_id
//             });

//             return res.json(product)
//         }

       
//     }
// }

// export { CreateProductController}

import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

class CreateProductController {
  async handle(req: Request, res: Response) {
    try {
      const { name, price, description, category_id } = req.body;

      console.log("📥 req.body:", req.body);
      console.log("📥 req.file:", req.file);

      // ✅ verifica se o arquivo chegou
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }

      // ✅ envia para Cloudinary usando stream
      const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "products" }, 
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as UploadApiResponse);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      // ✅ cria produto no banco
      const createProductService = new CreateProductService();
      const product = await createProductService.execute({
        name,
        price,
        description,
        banner: resultFile.secure_url,
        category_id
      });

      return res.json(product);
    } catch (err) {
      console.error("❌ ERRO AO CRIAR PRODUTO:", err);
      return res.status(500).json({ error: "Erro interno ao criar produto" });
    }
  }
}

export { CreateProductController };
