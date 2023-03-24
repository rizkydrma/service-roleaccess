import { Request, Response } from 'express';
import SubMenu from '../db/models/SubMenu';
import Helper from '../helpers/Helper';

const CreateSubMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, masterMenuId, url, title, icon, ordering, isTargetSelf } =
      req.body;

    const submenu = await SubMenu.create({
      name,
      masterMenuId,
      url,
      title,
      icon,
      ordering,
      isTargetSelf,
      active: true,
    });

    return res
      .status(200)
      .send(Helper.responseData(200, 'Created', null, submenu));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const GetListSubMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const submenus = await SubMenu.findAll({
      where: {
        active: true,
      },
    });

    return res.status(200).send(Helper.responseData(200, 'OK', null, submenus));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const GetAllSubMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const submenus = await SubMenu.findAll();

    return res.status(200).send(Helper.responseData(200, 'OK', null, submenus));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const GetDetailSubMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const submenu = await SubMenu.findOne({
      where: {
        id,
        active: true,
      },
    });

    if (!submenu) {
      return res
        .status(400)
        .send(Helper.responseData(400, 'Not Found', null, null));
    }

    return res.status(200).send(Helper.responseData(200, 'OK', null, submenu));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const UpdateSubMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, masterMenuId, url, title, icon, ordering, isTargetSelf } =
      req.body;

    const submenu = await SubMenu.findOne({
      where: {
        id,
        active: true,
      },
    });

    if (!submenu) {
      return res
        .status(400)
        .send(Helper.responseData(400, 'Not Found', null, null));
    }

    submenu.name = name;
    submenu.masterMenuId = masterMenuId;
    submenu.url = url;
    submenu.title = title;
    submenu.icon = icon;
    submenu.ordering = ordering;
    submenu.isTargetSelf = isTargetSelf;

    await submenu.save();
    return res
      .status(200)
      .send(Helper.responseData(200, 'Updated', null, null));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const SoftDelete = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const submenu = await SubMenu.findOne({
      where: {
        id,
        active: true,
      },
    });

    if (!submenu) {
      return res
        .status(400)
        .send(Helper.responseData(400, 'Not Found', null, null));
    }

    submenu.active = false;

    submenu.save();
    return res
      .status(200)
      .send(Helper.responseData(200, 'Removed', null, null));
  } catch (error) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

const DeleteSubMenu = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const submenu = await SubMenu.findOne({
      where: {
        id: id,
        active: true,
      },
    });

    if (!submenu) {
      return res
        .status(404)
        .send(Helper.responseData(404, 'NotFound', null, null));
    }

    await submenu.destroy();
    return res
      .status(200)
      .send(Helper.responseData(200, 'Deleted', null, null));
  } catch (error: any) {
    return res.status(500).send(Helper.responseData(500, '', error, null));
  }
};

export default {
  CreateSubMenu,
  GetListSubMenu,
  GetAllSubMenu,
  GetDetailSubMenu,
  UpdateSubMenu,
  SoftDelete,
  DeleteSubMenu,
};
