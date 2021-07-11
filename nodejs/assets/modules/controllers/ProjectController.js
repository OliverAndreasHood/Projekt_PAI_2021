const sequelize = require('../sequelize');
const User = require('../database/models/User');
const Organization = require('../database/models/Organization');
const Project = require('../database/models/Project');
const Kanban = require('../database/models/Kanban');
const KanbanColumn = require('../database/models/KanbanColumn');
const KanbanColumnCard = require('../database/models/KanbanColumnCard');
const { io } = require('../socket');

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

        try{
            decoded = jwt.verify(authorization, process.env.TOKEN_KEY);
            var user_id = decoded.sub;

            return await User.findOne({
                where: {
                    id: user_id,
                },
                include: UserIncludeAllConfig,
                attributes: {
                    exclude: ['password', 'updated_at', 'created_at', 'email', ],
                },
            });
        }catch(e){
            return false;
        }
    }else{
        return false;
    }
}

async function listAll(request, response, next){
    // Return all projects
    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            Project.findAll().then(data => response.json(data)).catch(error => {
                next(errorToReturn);
            });
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function createProject(request, response, next){
    // Create new project
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "manager"){
            // If user is manager only then user can create new project
            Organization.findOne({
                where: {
                    id: obj.organization_id,
                },
                include: [{model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },}],
            }).then(organizationModel => {
                organizationModel.createProject({
                    name: obj.name,
                }).then(projectModel => {
                    projectModel.createKanban({

                    }).then(kanbanModel => {
                        kanbanModel.createKanbanColumn({
                            name: "Tasks",
                            position: 1,
                        }).then(kanbanColumnModelOne => {
                            kanbanModel.createKanbanColumn({
                                name: "In Progress",
                                position: 2,
                            })
                        }).then(kanbanColumnModelTwo => {
                            kanbanModel.createKanbanColumn({
                                name: "Done",
                                position: 3,
                            }).then(kanbanColumnModelThree => {
                                response.json({message: "Project created sucessfully."});

                                SocketUpdatesController.updateOrganizationData(organizationModel); // Refresh organization data on frontend

                            }).catch(error => next(errorToReturn));
                        }).catch(error => next(errorToReturn));
                    }).catch(error => next(errorToReturn));
                }).catch(error => next(errorToReturn));
            }).catch(error => next(errorToReturn));
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function updateProject(request, response, next){
    var obj = request.fields;
    var {id, ...objectWithoutId} = obj;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "manager"){
            // If user is manager only then user can update project
            Project.update(objectWithoutId, {
                where: {
                    id: obj.id,
                }
            }).then(async data => {
                response.json({message: "Project updated sucessfully."});

                var project = await Project.findOne({ where: {id: obj.id}, include: [{model: Organization,}], });
                SocketUpdatesController.updateOrganizationData(project.Organization); // Refresh organization data on frontend
            }).catch(error => {
                next(errorToReturn);
            });
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function deleteProject(request, response, next){
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "manager"){
            // If user is manager only then user can delete project
            Project.findOne({
                where: {
                    id: obj.id,
                },
                include: [{model: User, as: "Members"}, {model: Organization, include: [{model: User, as: "Members"}]}],
            }).then(async projectModel => {
                var organizationCopy = projectModel.Organization; // store organization in var since it's not accessable after destroying the project
                await projectModel.destroy();

                SocketUpdatesController.updateOrganizationData(organizationCopy); // Refresh organization data on frontend
            }).then(data => response.json({message: "Project deleted sucessfully."})).catch(error => {
                next(errorToReturn);
            });
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function columnCreate(request, response, next){
    // Create new column in kanban
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    // Used to reset kanban columns positions
    var resetKanbanColumnsOrder = new Promise(async function(resolve, reject){
        Kanban.findOne({
            where: {
                id: obj.id,
            },
            include: {all: true},
        }).then(async data => {
            for(var i=0; i<data.KanbanColumns.length; i++){
                await data.KanbanColumns[i].update({
                    position: (i+1),
                });
            }

            resolve(true);
        }).catch(reject);
    });

    Kanban.findOne({
        where: {
            id: obj.id,
        },
        include: [{model: Project, as: "Project", include: [{model: Organization}],}],
    }).then(async kanbanModel => {
        console.log(kanbanModel);
        var newPosition = await kanbanModel.countKanbanColumns();
        console.log(newPosition);
        kanbanModel.createKanbanColumn({
            name: obj.name,
            position: newPosition+1,
        }).then(data => {

            console.log(kanbanModel.Project, kanbanModel.Project.Organization)
            SocketUpdatesController.updateOrganizationData(kanbanModel.Project.Organization); // Refresh organization data on frontend

            resetKanbanColumnsOrder.then(data => response.json({message: "Project kanban column created sucessfully."})).catch(error => next(errorToReturn));
        }).catch(error => next(errorToReturn));
    }).catch(error => next(errorToReturn));
}

async function columnDelete(request, response, next){
    // Delete column from kanban
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "manager"){
            // if user is manager only then user can delete column from kanban

            // Used to reset kanban columns positions
            var resetKanbanColumnsOrder = new Promise(async function(resolve, reject){
                Kanban.findOne({
                    where: {
                        id: obj.kanban_id,
                    },
                    include: {all: true},
                }).then(async data => {
                    for(var i=0; i<data.KanbanColumns.length; i++){
                        await data.KanbanColumns[i].update({
                            position: (i+1),
                        });
                    }

                    resolve(true);
                }).catch(reject);
            });

            KanbanColumn.findOne({
                where: {
                    id: obj.id,
                    kanban_id: obj.kanban_id,
                },
                include: [{model: Kanban, include: [{model: Project, as: "Project", include: [{model: Organization,}]}],}],
            }).then(kanbanColumnModel => {
                kanbanColumnModel.destroy().then(data => {

                    SocketUpdatesController.updateOrganizationData(kanbanColumnModel.Kanban.Project.Organization); // Refresh organization data on frontend

                    resetKanbanColumnsOrder.then(data => response.json({message: "Project kanban column deleted sucessfully."})).catch(error => next(error));
                }).catch(error => next(errorToReturn));
            }).catch(error => next(errorToReturn));
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function columnUpdate(request, response, next){
    // Update an existing column in kanban
    var obj = request.fields;
    var {id, ...objectWithoutId} = obj;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    if(objectWithoutId.name !== undefined && objectWithoutId.name !== null && typeof objectWithoutId.name === "string"){
        // Updating name
        KanbanColumn.update({ name: objectWithoutId.name, }, {
            where: {
                id: obj.id,
                kanban_id: obj.kanban_id,
            },
            include: [{model: Kanban, include: [{model: Project, as: "Project", include: [{model: Organization,}]}],}],
        }).then(kanbanColumnModel => {
            response.json({message: "Project kanban column updated sucessfully."});
            
            SocketUpdatesController.updateOrganizationData(kanbanColumnModel.Kanban.Project.Organization); // Refresh organization data on frontend
        }).catch(error => next(errorToReturn));
    }else{
        if(objectWithoutId.position_new !== undefined && objectWithoutId.position_new !== null && Number.isInteger(objectWithoutId.position_new) && objectWithoutId.position_old !== undefined && objectWithoutId.position_old !== null && Number.isInteger(objectWithoutId.position_old)){
            // Updating position
            KanbanColumn.findOne({
                where: {
                    kanban_id: obj.kanban_id,
                    position: obj.position_new,
                },
                include: [{model: Kanban, include: [{model: Project, as: "Project", include: [{model: Organization,}]}],}],
            }).then(columnAtNewPosition => {
                KanbanColumn.findOne({
                    where: {
                        id: obj.id,
                        kanban_id: obj.kanban_id,
                        position: obj.position_old,
                    }
                }).then(columnToChangePositionOf => {
                    KanbanColumn.update({ position: obj.position_old, }, {
                        where: {
                            kanban_id: obj.kanban_id,
                            position: obj.position_new,
                        }
                    }).then(success => {
                        KanbanColumn.update({ position: obj.position_new, }, {
                            where: {
                                id: obj.id,
                                kanban_id: obj.kanban_id,
                                position: obj.position_old,
                            }
                        }).then(data => {
                            response.json({message: "Project kanban column updated sucessfully."});

                            SocketUpdatesController.updateOrganizationData(columnAtNewPosition.Kanban.Project.Organization); // Refresh organization data on frontend
                        }).catch(error => next(errorToReturn));
                    }).catch(error => next(errorToReturn));
                }).catch(error => next(errorToReturn));
            }).catch(error => next(errorToReturn));
        }
    }
}

async function cardCreate(request, response, next){
    // Create new card in kanban column
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        KanbanColumn.findOne({
            where: {
                id: obj.id,
                kanban_id: obj.kanban_id,
            },
            include: [{model: Kanban, include: [{model: Project, as: "Project", include: [{model: Organization,}]}],}],
        }).then(async kanbanColumnModel => {
            kanbanColumnModel.createKanbanColumnCard({
                title: obj.title,
                description: obj.description,
                start_date: obj.start_date,
                end_date: obj.end_date,
                color: obj.color,
                importance: obj.importance,
                user_id: user.id, // creator user id
            }).then(data => {
                response.json({message: "Project kanban column card created sucessfully."});

                SocketUpdatesController.updateOrganizationData(kanbanColumnModel.Kanban.Project.Organization); // Refresh organization data on frontend
            }).catch(error => next(errorToReturn));
        }).catch(error => next(errorToReturn));
    }else{ next(errorToReturn); }
}

async function cardDelete(request, response, next){
    // Delete card from kanban column
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "manager"){
            // If user is manager only then user can delete card from kanban column
            KanbanColumn.findOne({
                where: {
                    id: obj.kanban_column_id,
                    kanban_id: obj.kanban_id,
                },
                include: [{model: Kanban, include: [{model: Project, as: "Project", include: [{model: Organization,}]}],}],
            }).then(kanbanColumnModel => {
                KanbanColumnCard.findOne({
                    where: {
                        id: obj.id,
                        column_id: obj.kanban_column_id,
                    }
                }).then(cardModel => {
                    cardModel.destroy().then(data => {
                        response.json({message: "Project kanban column card deleted sucessfully."});

                        SocketUpdatesController.updateOrganizationData(kanbanColumnModel.Kanban.Project.Organization); // Refresh organization data on frontend
                    }).catch(error => next(errorToReturn));
                }).catch(error => next(errorToReturn));
            }).catch(error => next(errorToReturn));
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function cardUpdate(request, response, next){
    // Update an existing card in kanban column
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    KanbanColumn.findOne({
        where: {
            id: obj.old_kanban_column_id,
            kanban_id: obj.kanban_id,
        },
        include: [{model: Kanban, include: [{model: Project, as: "Project", include: [{model: Organization,}]}],}],
    }).then(oldKanbanColumnModel => {
        KanbanColumn.findOne({
            where: {
                id: obj.new_kanban_column_id,
                kanban_id: obj.kanban_id,
            }
        }).then(newKanbanColumnModel => {
            KanbanColumnCard.findOne({
                where: {
                    id: obj.id,
                    column_id: oldKanbanColumnModel.id,
                }
            }).then(cardModel => {
                KanbanColumnCard.update({ column_id: newKanbanColumnModel.id, }, { // new column id
                    where: {
                        id: obj.id,
                        column_id: oldKanbanColumnModel.id,
                    }
                }).then(data => {
                    response.json({message: "Project kanban column card updated sucessfully."});

                    SocketUpdatesController.updateOrganizationData(oldKanbanColumnModel.Kanban.Project.Organization); // Refresh organization data on frontend
                }).catch(error => next(errorToReturn));
            }).catch(error => next(errorToReturn));
        }).catch(error => next(errorToReturn));
    }).catch(error => next(errorToReturn));
}

async function cardColorUpdate(request, response, next){
    // Update an existing card's color
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        KanbanColumnCard.update({ color: obj.color, }, {
            where: {
                id: obj.id,
                user_id: user.id, // user_id (creator user id) has to be equal to user (who is requesting this action) 's id
            },
        }).then(async data => {
            var card = await KanbanColumnCard.findOne({
                where:{
                    id: obj.id, 
                    user_id: user.id,
                }, 
                include: [{model: KanbanColumn, include: [{model: Kanban, include: [{model: Project, as: "Project", include: [{model: Organization,}]}],}]}], 
            });

            SocketUpdatesController.updateOrganizationData(card.KanbanColumn.Kanban.Project.Organization); // Refresh organization data on frontend

            response.json({message: "Project kanban column card updated sucessfully."});
        }).catch(error => next(error));
    }else{ next(errorToReturn); }
}

async function assignProjectMember(request, response, next){
    // Assign new user to a project as a member
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;
    
    var user = await getUserByToken(request);
    if(user){
        if(user.type == "manager"){
            Project.findOne({
                where: {
                    id: obj.id,
                },
                include: [{model: Organization}],
            }).then(projectModel => {
                User.findOne({
                    where: {
                        id: obj.user_id,
                    },
                    include: [
                        {model: Project, as: "MemberProjects"},
                    ],
                }).then(async userModel => {
                    // Remove user who is being assigned as a member in a project from all other joined projects
                    if(userModel.MemberProjects.length > 0){
                        for(var i=0; i<userModel.MemberProjects.length; i++){
                            await userModel.MemberProjects[i].removeMember(userModel);
                        }
                    }
                    
                    projectModel.addMember(userModel).then(data => {
                        response.json({message: "Member assigned sucessfully."});

                        SocketUpdatesController.updateOrganizationData(projectModel.Organization); // Refresh organization data on frontend
                    }).catch(error => {next(errorToReturn);});
                }).catch(error => {next(errorToReturn);});
            }).catch(error => {next(errorToReturn);});
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function removeProjectMember(request, response, next){
    // Remove user as a member from a project
    var obj = request.fields;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "manager"){
            // If user is a manager only then user can remove a project member
            Project.findOne({
                where: {
                    id: obj.id,
                },
                include: [{model: Organization}],
            }).then(projectModel => {
                User.findOne({
                    where: {
                        id: obj.user_id,
                    },
                }).then(async userModel => {
                    projectModel.removeMember(userModel).then(data => { // Remove member
                        response.json({message: "Member removed sucessfully."});

                        SocketUpdatesController.updateOrganizationData(projectModel.Organization); // Refresh organization data on frontend
                    }).catch(error => {next(errorToReturn);});
                }).catch(error => {next(errorToReturn);});
            }).catch(error => {next(errorToReturn);});
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

module.exports = {
    listAll,
    createProject,
    updateProject,
    deleteProject,
    columnCreate,
    columnDelete,
    columnUpdate,
    cardCreate,
    cardDelete,
    cardUpdate,
    cardColorUpdate,
    assignProjectMember,
    removeProjectMember,
}