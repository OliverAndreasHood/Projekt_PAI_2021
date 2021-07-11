const { sequelize, Op } = require('../sequelize');
const User = require('../database/models/User');
const Organization = require('../database/models/Organization');
const Project = require('../database/models/Project');
const Kanban = require('../database/models/Kanban');
const KanbanColumn = require('../database/models/KanbanColumn');
const KanbanColumnCard = require('../database/models/KanbanColumnCard');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { io } = require('../socket');

const SocketUpdatesController = require('../controllers/SocketUpdatesController');

// User config used to fetch data from the database.
const UserIncludeAllConfig = [
    {
        model: Organization, 
        as: "ManagingOrganization",
        include: [
            {model: User, as: "Manager",},
            {model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], }, through: {attributes: []},},
            {
                model: Project, 
                as: "Projects",
                include: [
                    {model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], }, through: {attributes: []},},
                    {
                        model: Kanban, 
                        as: "Kanban",
                        include: [
                            {
                                model: KanbanColumn,
                                include: [
                                    {model: KanbanColumnCard,}
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        model: Organization, 
        as: "MemberOrganizations",
        through: {attributes: []},
        include: [
            {model: User, as: "Manager",},
            {model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], }, through: {attributes: []},},
            {
                model: Project, 
                as: "Projects",
                include: [
                    {model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], }, through: {attributes: []},},
                    {
                        model: Kanban, 
                        as: "Kanban",
                        include: [
                            {
                                model: KanbanColumn,
                                include: [
                                    {model: KanbanColumnCard,}
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

// Organization config used to fetch data from the database.
const OrganizationIncludeAllConfig = [
    {model: User, as: "Manager",},
    {model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], }, through: {attributes: []},},
    {
        model: Project, 
        as: "Projects",
        include: [
            {model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], }, through: {attributes: []},},
            {
                model: Kanban, 
                as: "Kanban",
                include: [
                    {
                        model: KanbanColumn,
                        include: [
                            {model: KanbanColumnCard,}
                        ],
                    },
                ],
            },
        ],
    },
];

async function getUserByToken(request){
    // Get user by using user_id encoded in the authorization token
    if(request.headers && request.headers.authorization) {
        var authorization = request.headers.authorization.split(' ')[1];
        var decoded = null;

        console.log(authorization);

        try{
            decoded = jwt.verify(authorization, process.env.TOKEN_KEY);
            var user_id = decoded.sub;

            return await User.findOne({
                where: {
                    id: user_id,
                },
                include: UserIncludeAllConfig,
                attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
            });
        }catch(e){
            console.log("failing here 2", e);
            return false;
        }
    }else{
        console.log("failing here 1");
        return false;
    }
}

async function listAll(request, response, next){
    // Return all organizations
    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            Organization.findAll().then(data => response.json(data)).catch(error => {
                next(errorToReturn);
            });
        }
    }
}

async function createOrganization(request, response, next){
    // Create new organization
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            Organization.create({
                name: obj.name,
            }).then(data => {
                response.json({message: "Organization created sucessfully."});

                SocketUpdatesController.updateUserData(user); // Refresh user frontend data
            }).catch(error => {
                next(errorToReturn);
            });
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function updateOrganization(request, response, next){
    // Update an existing organization
    var obj = request.fields;
    var {id, ...objectWithoutId} = obj;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            Organization.update(objectWithoutId, {
                where: {
                    id: obj.id,
                }
            }).then(data => {
                response.json({message: "Organization updated sucessfully."});

                SocketUpdatesController.updateUserData(user); // Refresh user frontend data
            }).catch(error => {
                next(errorToReturn);
            });
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function updateOrganizationManager(request, response, next){
    // Assign new manager to an organization
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            Organization.findOne({
                where: {
                    id: obj.id,
                }
            }).then(organizationModel => {
                User.findOne({
                    where: {
                        id: obj.user_id,
                        type: {
                            [Op.ne]: "manager", 
                        },
                    },
                    attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
                    include: [  {model: Organization, as: "MemberOrganizations"}, ],
                }).then(async userModel => {
                    // Remove user who is to be assigned as new manager from all joined organizations
                    if(userModel.MemberOrganizations.length > 0){
                        for(var i=0; i<userModel.MemberOrganizations.length; i++){
                            await userModel.MemberOrganizations[i].removeMember(userModel);
                        }
                    }

                    organizationModel.setManager(userModel).then(async successData => { // Set user as the manager

                        await organizationModel.addMember(userModel); // Add user as a member too

                        User.update({ type: "manager", }, {
                            where: {
                                id: obj.user_id,
                                type: {
                                    [Op.ne]: "manager", 
                                },
                            }
                        }).then(data => {
                            response.json({message: "Organization manager updated sucessfully."});

                            SocketUpdatesController.updateUserData(user); // Refresh user frontend data
                            SocketUpdatesController.updateUserData(userModel); // Refresh user (manager) frontend data
                        }).catch(error => {next(errorToReturn);});
                    }).catch(error => {next(errorToReturn);});
                }).catch(error => {next(errorToReturn);});
            }).catch(error => {next(errorToReturn);});
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function deleteOrganization(request, response, next){
    // Delete an organization
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            Organization.findOne({
                where: {
                    id: obj.id,
                },
                include: [{model: User, as: "Manager",}]
            }).then(organizationModel => {
                var managerCopy = organizationModel.Manager; // Save manager in a variable since it's not accessable after destroying the org.

                organizationModel.destroy();

                SocketUpdatesController.updateUserData(managerCopy); // Refresh user (manager) frontend data
            }).then(data => {
                response.json({message: "Organization deleted sucessfully."});

                SocketUpdatesController.updateUserData(user); // Refresh user frontend data
            }).catch(error => {
                next(errorToReturn);
            });
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function assignOrganizationMember(request, response, next){
    // Assign user to an organization as member
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    console.log(user);
    if(user){
        if(user.type == "admin"){
            Organization.findOne({
                where: {
                    id: obj.id,
                },
            }).then(organizationModel => {
                User.findOne({
                    where: {
                        id: obj.user_id,
                    },
                    attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
                    include: [
                        {model: Organization, as: "MemberOrganizations"},
                    ],
                }).then(async userModel => {
                    // Remove user from all joined organizations
                    if(userModel.MemberOrganizations.length > 0){
                        for(var i=0; i<userModel.MemberOrganizations.length; i++){
                            await userModel.MemberOrganizations[i].removeMember(userModel);
                        }
                    }
                    
                    organizationModel.addMember(userModel).then(data => { // Add user as a member
                        response.json({message: "Member assigned sucessfully."});

                        SocketUpdatesController.updateUserData(user); // Refresh user frontend data
                        SocketUpdatesController.updateUserData(userModel); // Refresh user (member) frontend data
                    }).catch(error => {next(error);});
                }).catch(error => {next(error);});
            }).catch(error => {next(error);});
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

module.exports = {
    listAll,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    updateOrganizationManager,
    assignOrganizationMember,
}