import express from 'express';
import RoleController from '../controllers/RoleController';
import UserController from '../controllers/UserController';
import MasterMenuController from '../controllers/MasterMenuController';
import Authorization from '../middleware/Authorization';
import UserValidation from '../middleware/validation/UserValidation';
import MenuValidation from '../middleware/validation/MenuValidation';
import SubMenuController from '../controllers/SubMenuController';
import RoleMenuAccessController from '../controllers/RoleMenuAccessController';

const router = express.Router();

router.get('/role', RoleController.GetRole);
router.get('/role/:id', RoleController.GetRoleById);
router.post('/role',Authorization.Authenticated, Authorization.Admin, RoleController.CreateRole);
router.post('/role/:id', Authorization.Authenticated, Authorization.Admin, RoleController.UpdateRole);
router.delete('/role/:id', Authorization.Authenticated, Authorization.SuperUser, RoleController.DeleteRole);

// User Routing
router.post('/user/signup', UserValidation.RegisterValidation, UserController.Register);
router.post('/user/login', UserController.UserLogin);
router.get('/user/refresh-token', UserController.RefreshToken);
router.get('/user/current-user', Authorization.Authenticated, UserController.UserDetail);
router.get('/user/logout', Authorization.Authenticated, UserController.UserLogout);
router.get('/users', Authorization.Authenticated, Authorization.SuperUser, UserController.GetAllUser);

// Master Menu Routing
router.post('/menu', MenuValidation.CreateMenuValidation, Authorization.Authenticated, Authorization.Admin, MasterMenuController.CreateMenu);
router.get('/menu', Authorization.Authenticated, Authorization.Admin, MasterMenuController.GetListMenu);
router.get('/menu/all', Authorization.Authenticated, Authorization.SuperUser, MasterMenuController.GetAllMenu);
router.get('/menu/:id', Authorization.Authenticated, Authorization.Admin, MasterMenuController.GetDetailMenu);
router.patch('/menu/:id', MenuValidation.CreateMenuValidation, Authorization.Authenticated, Authorization.Admin, MasterMenuController.UpdateMenu);
router.delete('/menu/:id', Authorization.Authenticated, Authorization.Admin, MasterMenuController.SoftDeleteMenu);
router.delete('/menu/permanent/:id', Authorization.Authenticated, Authorization.SuperUser, MasterMenuController.DeleteMenu);

// Submenu routing
router.post("/sub-menu", MenuValidation.CreateSubMenuValidation, Authorization.Authenticated, Authorization.Admin, SubMenuController.CreateSubMenu);
router.get("/sub-menu", Authorization.Authenticated, Authorization.Admin, SubMenuController.GetListSubMenu);
router.get("/sub-menu/get/all", Authorization.Authenticated, Authorization.SuperUser, SubMenuController.GetAllSubMenu);
router.get("/sub-menu/:id", Authorization.Authenticated, Authorization.Admin, SubMenuController.GetDetailSubMenu);
router.patch("/sub-menu/:id", MenuValidation.CreateSubMenuValidation, Authorization.Authenticated, Authorization.Admin, SubMenuController.UpdateSubMenu);
router.delete("/sub-menu/:id", Authorization.Authenticated, Authorization.Admin, SubMenuController.SoftDelete);
router.delete("/sub-menu/permanent/:id", Authorization.Authenticated, Authorization.SuperUser, SubMenuController.DeleteSubMenu);

// Role Menu Access
router.post("/role-menu-access", MenuValidation.CreateRoleMenuAccess , Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.CreateAccess);
router.get("/role-menu-access", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.GetList);
router.get("/role-menu-access/get/all", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.GetAll);
router.get("/role-menu-access/:id", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.GetDetail);
router.patch("/role-menu-access/:id", MenuValidation.CreateRoleMenuAccess, Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.UpdateAccess);
router.delete("/role-menu-access/:id", Authorization.Authenticated, Authorization.SuperUser, RoleMenuAccessController.SoftDelete);

export default router;
