import { NextFunction, Request, Response } from 'express';
import Role from '../db/models/Role';
import User from '../db/models/User';
import Helper from '../helpers/Helper';
import PasswordHelper from '../helpers/PasswordHelper';

const Register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, roleId, confirmPassword } = req.body;

    const hashed = await PasswordHelper.PasswordHashing(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      active: true,
      verified: true,
      roleId: roleId,
    });

    return res
      .status(201)
      .send(Helper.responseData(201, 'Created', null, user));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const UserLogin = async (req: Request, res: Response): Promise<Response> => {
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

    const userData = {
      name: decodeUser.name,
      email: decodeUser.email,
      roleId: decodeUser.roleId,
      verified: decodeUser.verified,
      active: decodeUser.active,
    };

    const token = Helper.generateToken(userData);

    const resultUser = {
      ...userData,
      token: token,
    };

    return res
      .status(200)
      .send(Helper.responseData(200, 'OK', null, resultUser));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const GetAllUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password', 'accessToken'],
      },
      include: {
        model: Role,
        attributes: ['id', 'roleName'],
      },
    });

    return res.status(200).send(Helper.responseData(200, 'OK', null, users));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const UserDetail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const email = res.locals.email;
    const user = await User.findOne({
      attributes: {
        exclude: ['password', 'accessToken'],
      },
      where: {
        email: email,
      },
      include: {
        model: Role,
        attributes: ['id', 'roleName'],
      },
    });

    if (!user) {
      return res
        .status(404)
        .send(Helper.responseData(404, 'User Not Found', null, null));
    }

    return res.status(200).send(Helper.responseData(200, 'OK', null, user));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const UserLogout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res
        .status(200)
        .send(Helper.responseData(200, 'User Logout', null, null));
    }

    const email = res.locals.email;
    const user = await User.findOne({
      attributes: {
        exclude: ['password', 'accessToken'],
      },
      where: {
        email: email,
      },
    });

    if (!user) {
      res.clearCookie('refreshToken');
      return res
        .status(200)
        .send(Helper.responseData(200, 'User Logout', null, null));
    }

    await user.update({ accessToken: null }, { where: { email: email } });
    res.clearCookie('refreshToken');

    return res
      .status(200)
      .send(Helper.responseData(200, 'User Logout', null, null));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

export default {
  Register,
  UserLogin,
  RefreshToken,
  UserDetail,
  UserLogout,
  GetAllUser,
};
