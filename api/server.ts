//Express
import express from "express";
import { NextFunction, Request, Response } from "express";
const port = 3100;
const app = express();

//JWT
import cookieParser from "cookie-parser";
import { isTokenValid, refreshToken } from "./middleware/jwt/jwtImplementation";
import bodyParser from "body-parser";
//Helmet
import helmet from "helmet";
import multer from "multer";
//Routers
import { userRouter } from "./Routes/userRoutes";
import { restaurantRouter } from "./Routes/restaurantRoutes";
import { ratingRouter } from "./Routes/ratingRoutes";
import { addressRouter } from "./Routes/adressRoutes";
import { adminRouter } from "./Routes/addAdmin";
import fs from 'fs';

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req: Request, res: any, next: NextFunction) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/user", userRouter);
app.use("/restaurant", restaurantRouter);
app.use("/rating", ratingRouter);
app.use("/address", addressRouter);
// app.use("/admin", adminRouter);

app.listen(3000, () => {
  console.log("Servidor está rodando na porta 3000");
});

import { Request as ExpressRequest } from 'express';
import { mySqlConnection} from "./middleware/db/mysql";
import { Connection } from "mysql2/typings/mysql/lib/Connection";

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

declare global {
    namespace Express {
        interface Request {
            file: MulterFile;
        }
    }
}

import { ResultSetHeader, RowDataPacket } from 'mysql2';


app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("imagem"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send("Nenhuma imagem foi enviada.");
    }

    if (req.file.size === 0) {
      return res.status(400).send("O arquivo enviado está vazio.");
    }

    const [existingRows] = await mySqlConnection.promise().query<RowDataPacket[]>('SELECT * FROM imagens LIMIT 1');
    if (existingRows.length > 0) {
      return res.status(400).send("Já existe uma imagem inserida no banco de dados.");
    }

    const [result] = await mySqlConnection.promise().query<ResultSetHeader>('INSERT INTO imagens (imagem) VALUES (?)', [req.file.buffer]);

    console.log('Resultado da inserção:', result);

    if (result.affectedRows !== 1) {
      return res.status(500).send('Erro ao inserir a imagem.');
    }

    return res.status(200).send('Imagem enviada com sucesso.');
  } catch (error) {
    console.error('Erro ao enviar a imagem:', error);
    return res.status(500).send('Erro interno do servidor.');
  }
});
  
  app.get('/imagem/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
  
      const [rows] = await mySqlConnection.promise().query<RowDataPacket[]>('SELECT * FROM imagens WHERE id = ?', [id]);
      console.log('Imagem encontrada:', rows[0]);
      
      if (rows.length === 0) {
        return res.status(404).send('Imagem não encontrada.');
      }
  
      const imagemBuffer = rows[0].imagem as Buffer;
  
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename=imagem-${id}.png`
      });
  
      res.end(imagemBuffer);
    } catch (error) {
      console.error('Erro ao buscar a imagem:', error);
      return res.status(500).send('Erro interno do servidor.');
    }
  });

  /// eu criei uma table de nome imagem, nao tinha visto a de fotos, tenta converter e descobrir os erros