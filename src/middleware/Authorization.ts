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
    res.locals.roleId = result?.roleId;
    next();
  } catch (error: any) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const SuperUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;
    if (roleId !== 1) {
      return res
        .status(403)
        .send(Helper.responseData(403, 'Forbidden Access', null, null));
    }
    next();
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const Admin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;

    if (roleId !== 2) {
      return res
        .status(403)
        .send(Helper.responseData(403, 'Forbidden Access', null, null));
    }
    next();
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const BasicUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = res.locals.roleId;

    if (roleId !== 3) {
      return res
        .status(403)
        .send(Helper.responseData(403, 'Forbidden Access', null, null));
    }
    next();
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

export default { Authenticated, SuperUser, Admin, BasicUser };
