import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/Routes';
dotenv.config();
const app = express();
app.use(express.json());
app.use(router);

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    response: 'Express Typescript',
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(
    `APP ${process.env.APP_NAME} Running On Port ${process.env.APP_PORT}`
  );
});
