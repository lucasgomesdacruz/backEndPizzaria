"use strict";
// import { Request, Response } from "express";
// import { CreateProductService } from "../../services/product/CreateProductService";
// import { UploadedFile } from "express-fileupload";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductController = void 0;
const CreateProductService_1 = require("../../services/product/CreateProductService");
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
class CreateProductController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, description, category_id } = req.body;
                console.log("📥 req.body:", req.body);
                console.log("📥 req.file:", req.file);
                // ✅ verifica se o arquivo chegou
                if (!req.file) {
                    return res.status(400).json({ error: "Nenhum arquivo enviado" });
                }
                // ✅ envia para Cloudinary usando stream
                const resultFile = yield new Promise((resolve, reject) => {
                    const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "products" }, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }
                    });
                    streamifier_1.default.createReadStream(req.file.buffer).pipe(uploadStream);
                });
                // ✅ cria produto no banco
                const createProductService = new CreateProductService_1.CreateProductService();
                const product = yield createProductService.execute({
                    name,
                    price,
                    description,
                    banner: resultFile.secure_url,
                    category_id
                });
                return res.json(product);
            }
            catch (err) {
                console.error("❌ ERRO AO CRIAR PRODUTO:", err);
                return res.status(500).json({ error: "Erro interno ao criar produto" });
            }
        });
    }
}
exports.CreateProductController = CreateProductController;
