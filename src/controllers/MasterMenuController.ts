import { Request, Response } from 'express';
import MasterMenu from '../db/models/MasterMenu';
import Helper from '../helpers/Helper';

const CreateMenu = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, icon, ordering } = req.body;
    const menu = await MasterMenu.create({
      name,
      icon,
      ordering,
      active: true,
    });

    return res
      .status(201)
      .send(Helper.responseData(201, 'Created', null, menu));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const GetListMenu = async (req: Request, res: Response): Promise<Response> => {
  try {
    const menu = await MasterMenu.findAll({
      where: {
        active: true,
      },
    });

    return res.status(200).send(Helper.responseData(200, 'OK', null, menu));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const GetAllMenu = async (req: Request, res: Response): Promise<Response> => {
  try {
    const menu = await MasterMenu.findAll();

    return res.status(200).send(Helper.responseData(200, 'OK', null, menu));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const GetDetailMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const menu = await MasterMenu.findOne({
      where: {
        id,
        active: true,
      },
    });

    if (!menu) {
      return res
        .status(404)
        .send(Helper.responseData(404, 'Data Not Found', null, null));
    }

    return res.status(200).send(Helper.responseData(200, 'OK', null, menu));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const UpdateMenu = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, icon, ordering } = req.body;

    const menu = await MasterMenu.findOne({
      where: {
        id,
        active: true,
      },
    });

    if (!menu) {
      return res
        .status(404)
        .send(Helper.responseData(404, 'Data Not Found', null, null));
    }

    menu.name = name;
    menu.icon = icon;
    menu.ordering = ordering;

    await menu.save();

    return res
      .status(200)
      .send(Helper.responseData(200, 'Updated', null, menu));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const SoftDeleteMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const menu = await MasterMenu.findOne({
      where: {
        id,
        active: true,
      },
    });

    if (!menu) {
      return res
        .status(404)
        .send(Helper.responseData(404, 'Data Not Found', null, null));
    }

    menu.active = false;

    await menu.save();
    return res
      .status(200)
      .send(Helper.responseData(200, 'Removed', null, null));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const DeleteMenu = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const menu = await MasterMenu.findOne({
      where: {
        id,
      },
    });

    if (!menu) {
      return res
        .status(404)
        .send(Helper.responseData(404, 'Data Not Found', null, null));
    }

    await menu.destroy();

    return res
      .status(200)
      .send(Helper.responseData(200, 'Deleted', null, null));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

export default {
  GetAllMenu,
  CreateMenu,
  GetListMenu,
  GetDetailMenu,
  UpdateMenu,
  SoftDeleteMenu,
  DeleteMenu,
};
