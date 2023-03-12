import { Request, Response } from 'express';
import Role from '../db/models/Role';
import { CatchError } from '../utils/Error';

const GetRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const roles = await Role.findAll({
      where: {
        active: true,
      },
    });

    return res.status(200).send({
      status: 200,
      message: 'OK',
      data: roles,
    });
  } catch (error: any) {
    return CatchError(req, res, error);
  }
};

const CreateRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { roleName, active } = req.body;

    const create = await Role.create({
      roleName,
      active,
    });

    return res.status(201).send({
      status: 201,
      message: 'Success Created',
      data: create,
    });
  } catch (error) {
    return CatchError(req, res, error);
  }
};

const UpdateRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { roleName, active } = req.body;

    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).send({
        status: 404,
        message: 'Data Not Found',
        data: null,
      });
    }

    role.roleName = roleName;
    role.active = active;

    await role.save();

    return res.status(200).send({
      status: 200,
      message: 'Success Updated',
      data: role,
    });
  } catch (error) {
    return CatchError(req, res, error);
  }
};

const DeleteRole = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).send({
        status: 404,
        message: 'Data Not Found',
        data: null,
      });
    }

    await role.destroy();

    return res.status(200).send({
      status: 200,
      message: 'Deleted',
      data: role,
    });
  } catch (error) {
    return CatchError(req, res, error);
  }
};

const GetRoleById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).send({
        status: 404,
        message: 'Data Not Found',
        data: null,
      });
    }

    return res.status(200).send({
      status: 200,
      message: 'OK',
      data: role,
    });
  } catch (error) {
    return CatchError(req, res, error);
  }
};

export default { GetRole, CreateRole, UpdateRole, DeleteRole, GetRoleById };
