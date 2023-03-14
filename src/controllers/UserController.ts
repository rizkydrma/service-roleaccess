import { NextFunction, Request, Response } from 'express';
import User from '../db/models/User';
import Helper from '../helpers/Helper';
import PasswordHelper from '../helpers/PasswordHelper';

const Register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const hashed = await PasswordHelper.PasswordHashing(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      active: true,
      verified: true,
      roleId: 1,
    });

    return res
      .status(201)
      .send(Helper.responseData(201, 'Created', null, user));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const UserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .send(Helper.responseData(400, 'Unauthorize', null, null));
    }

    const matched = await PasswordHelper.PasswordCompare(
      password,
      user.password!
    );
    if (!matched) {
      return res
        .status(401)
        .send(Helper.responseData(400, 'Unauthorize', null, null));
    }

    const dataUser = {
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      verified: user.verified,
      active: user.active,
    };
    const token = Helper.generateToken(dataUser);
    const refreshToken = Helper.generateRefreshToken(dataUser);

    user.accessToken = refreshToken;
    await user.save();
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const responseUser = {
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      verified: user.verified,
      active: user.active,
      token: token,
    };
    return res
      .status(200)
      .send(Helper.responseData(200, 'OK', null, responseUser));
  } catch (error: any) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const RefreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .send(Helper.responseData(401, 'Unauthorized', null, null));
    }

    const decodeUser = Helper.extractRefreshToken(refreshToken);
    if (!decodeUser) {
      return res
        .status(401)
        .send(Helper.responseData(401, 'Unauthorized', null, null));
    }

    const token = Helper.generateToken({
      name: decodeUser.name,
      email: decodeUser.email,
      roleId: decodeUser.roleId,
      verified: decodeUser.verified,
      active: decodeUser.active,
    });

    const resultUser = {
      name: decodeUser.name,
      email: decodeUser.email,
      roleId: decodeUser.roleId,
      verified: decodeUser.verified,
      active: decodeUser.active,
      token: token,
    };

    return res
      .status(200)
      .send(Helper.responseData(200, 'OK', null, resultUser));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

export default { Register, UserLogin, RefreshToken };
