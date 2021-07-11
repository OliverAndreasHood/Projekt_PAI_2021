// Module for creating public api routes which are used by the frontend to contact the backend

const express = require('express');
const router = express.Router();
const UserController = require("./controllers/UserController");
const OrganizationController = require("./controllers/OrganizationController");
const ProjectController = require("./controllers/ProjectController");
const RequestValidator = require('./requestvalidator');

// Routes

// format : router.[request_method](url_path, middleware, function to handle the request);

router.post('/user/login', RequestValidator.validate, UserController.login);

router.post('/user/me', UserController.me);

//router.get('/users/', UserController.listAll);
router.post('/user/create', RequestValidator.validate, UserController.createUser);
router.post('/user/delete', RequestValidator.validate, UserController.deleteUser);
router.post('/user/update', RequestValidator.validate, UserController.updateUser);

//router.get('/organizations/', OrganizationController.listAll);
router.post('/organization/create', RequestValidator.validate, OrganizationController.createOrganization);
router.post('/organization/delete', RequestValidator.validate, OrganizationController.deleteOrganization);
router.post('/organization/update', RequestValidator.validate, OrganizationController.updateOrganization);
router.post('/organization/manager/update', RequestValidator.validate, OrganizationController.updateOrganizationManager);
router.post('/organization/member/assign', RequestValidator.validate, OrganizationController.assignOrganizationMember);

//router.get('/projects/', ProjectController.listAll);
router.post('/project/create', RequestValidator.validate, ProjectController.createProject);
router.post('/project/delete', RequestValidator.validate, ProjectController.deleteProject);
router.post('/project/update', RequestValidator.validate, ProjectController.updateProject);
router.post('/project/member/assign', RequestValidator.validate, ProjectController.assignProjectMember);
router.post('/project/member/remove', RequestValidator.validate, ProjectController.removeProjectMember);

router.post('/project/column/create', RequestValidator.validate, ProjectController.columnCreate);
router.post('/project/column/delete', RequestValidator.validate, ProjectController.columnDelete);
router.post('/project/column/update', RequestValidator.validate, ProjectController.columnUpdate);

router.post('/project/card/create', RequestValidator.validate, ProjectController.cardCreate);
router.post('/project/card/update', RequestValidator.validate, ProjectController.cardUpdate);
router.post('/project/card/color/update', RequestValidator.validate, ProjectController.cardColorUpdate);
router.post('/project/card/delete', RequestValidator.validate, ProjectController.cardDelete);

module.exports = router;