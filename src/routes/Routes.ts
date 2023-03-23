import express from 'express';
import RoleController from '../controllers/RoleController';
import UserController from '../controllers/UserController';
import MasterMenuController from '../controllers/MasterMenuController';
import Authorization from '../middleware/Authorization';
import UserValidation from '../middleware/validation/UserValidation';

const router = express.Router();

router.get('/role', RoleController.GetRole);
router.get('/role/:id', RoleController.GetRoleById);
router.post(
  '/role',
  Authorization.Authenticated,
  Authorization.Admin,
  RoleController.CreateRole
);
router.post(
  '/role/:id',
  Authorization.Authenticated,
  Authorization.Admin,
  RoleController.UpdateRole
);
router.delete(
  '/role/:id',
  Authorization.Authenticated,
  Authorization.SuperUser,
  RoleController.DeleteRole
);

// User Routing
router.post(
  '/user/signup',
  UserValidation.RegisterValidation,
  UserController.Register
);
router.post('/user/login', UserController.UserLogin);
router.get('/user/refresh-token', UserController.RefreshToken);
router.get(
  '/user/current-user',
  Authorization.Authenticated,
  UserController.UserDetail
);
router.get(
  '/user/logout',
  Authorization.Authenticated,
  UserController.UserLogout
);

// Master Menu Routing
router.post(
  '/menu',
  Authorization.Authenticated,
  Authorization.Admin,
  MasterMenuController.CreateMenu
);
router.get(
  '/menu',
  Authorization.Authenticated,
  Authorization.Admin,
  MasterMenuController.GetListMenu
);
router.get(
  '/menu/all',
  Authorization.Authenticated,
  Authorization.SuperUser,
  MasterMenuController.GetAllMenu
);
router.get(
  '/menu/:id',
  Authorization.Authenticated,
  Authorization.Admin,
  MasterMenuController.GetDetailMenu
);
router.patch(
  '/menu/:id',
  Authorization.Authenticated,
  Authorization.Admin,
  MasterMenuController.UpdateMenu
);
router.delete(
  '/menu/:id',
  Authorization.Authenticated,
  Authorization.Admin,
  MasterMenuController.SoftDeleteMenu
);
router.delete(
  '/menu/permanent/:id',
  Authorization.Authenticated,
  Authorization.SuperUser,
  MasterMenuController.DeleteMenu
);

export default router;
