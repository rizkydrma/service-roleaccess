import { Request, Response, NextFunction } from 'express';
import Helper from '../helpers/Helper';

const Authenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers['authorization'];
    const token = authToken && authToken.split(' ')[1];

    if (token === null) {
      return res
        .status(401)
        .send(Helper.responseData(401, 'Unautorized', null, null));
    }

    const result = Helper.extractToken(token!);
    if (!result) {
      return res
        .status(401)
        .send(Helper.responseData(401, 'Unautorized', null, null));
    }

    res.locals.email = result?.email;
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

export default { Authenticated };
