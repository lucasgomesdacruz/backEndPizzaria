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
        const { name, price, description, category_id } = req.body;

        // Se o multer não receber arquivo, retorna erro
        if (!req.file) {
            throw new Error("Nenhum arquivo enviado");
        }

        // 🔥 Envia para Cloudinary usando stream
        const resultFile: UploadApiResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "products" }, // 👈 opcional: cria uma pasta no Cloudinary
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

        // Cria o produto com a URL do Cloudinary
        const createProductService = new CreateProductService();
        const product = await createProductService.execute({
            name,
            price,
            description,
            banner: resultFile.secure_url, // 🔥 usa o link seguro do Cloudinary
            category_id
        });

        return res.json(product);
    }
}

export { CreateProductController };
