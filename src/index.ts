import express, { Request, Response } from 'express';

const app = express();

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    response: 'Express Typescript',
  });
});

app.listen(3000, () => {
  console.log('Running On Port 3000');
});
