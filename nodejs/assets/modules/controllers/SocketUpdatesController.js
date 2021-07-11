// Controller for handling socket.io connections requests
// Socket.io is used to instantaneously refresh/update data on the frontend when ever data is changed on the backend

require('dotenv').config();

const bcrypt = require("bcrypt");
const sequelize = require('../sequelize');
const jwt = require('jsonwebtoken');

const User = require('../database/models/User');
const Organization = require('../database/models/Organization');
const Project = require('../database/models/Project');
const Kanban = require('../database/models/Kanban');
const KanbanColumn = require('../database/models/KanbanColumn');
const KanbanColumnCard = require('../database/models/KanbanColumnCard');

const socket = require('../socket');

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

async function updateAllAdmins(){
    // Refresh frontend of all admins
    try{
        var admins = await User.findAll({
            where:{
                type: "admin",
            },
            include: UserIncludeAllConfig,
            attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
        });

        for(var i=0; i<admins.length; i++){
            updateUserData(admins[i]);
        }
    }catch(error){ return false; }
}

async function updateUserData(user, isId = false){
    // Refresh frontend user having id = user/user.id, isId has to be true when user is not a user model but user id
    var allDataUser = await User.findOne({
        where: {
            id: isId === true ? user : user.id,
        },
        include: UserIncludeAllConfig,
        attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
    });

    // Remove projects from MemberOrganizations returned with user (allDataUser) who the user is not a member of
    for(var i=0; i<allDataUser.MemberOrganizations.length; i++){
        for(var x=0; x<allDataUser.MemberOrganizations[i].Projects.length; x++){
            var checkForMembershipInProject = await allDataUser.MemberOrganizations[i].Projects[x].Members.find(x => x.id == allDataUser.id);
            console.log(checkForMembershipInProject);
            if(checkForMembershipInProject == undefined || checkForMembershipInProject == null){
                allDataUser.MemberOrganizations[i].Projects.splice(x, 1);
                x--;
            }
        }
    }

    if(user.type == "admin"){
        // If user is admin, return all users and organizations too
        var allUsers = await User.findAll({ 
            include: UserIncludeAllConfig,
            attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
        });

        var allOrganizations = await Organization.findAll({ 
            include: OrganizationIncludeAllConfig,
        });

        var data = {
            user: allDataUser,
            allUsers: allUsers,
            allOrganizations: allOrganizations,
        };

        console.log(socket);
        socket.getIO().then(io => io.to(`user:${allDataUser.id}`).emit('update', `user:${allDataUser.id}`, data));
    }else{
        // If user is not admin, return allDataUser (user's own data) only

        var data = allDataUser;
        socket.getIO().then(io => io.to(`user:${allDataUser.id}`).emit('update', `user:${allDataUser.id}`, data));
    }

    return true;
}

async function updateOrganizationData(organization, isId = false){
    // Refresh organization data on the frontend of those who have joined the organization's socket.io channel/room (members)
    var allDataOrganization = await Organization.findOne({
        where: {
            id: isId === true ? organization : organization.id,
        },
        include: OrganizationIncludeAllConfig,
    });

    var data = allDataOrganization;

    console.log(socket);
    socket.getIO().then(io => io.to(`organization:${allDataOrganization.id}`).emit('update', `organization:${allDataOrganization.id}`, data));

    updateUserData(allDataOrganization.manager_id, true); // Refresh organization's manager frontend
    updateAllAdmins(); // Refresh frontend of all admins
}

async function updateProjectData(project){
    // haven't used this function, left for future
    // can be used to refresh only project data on the frontend
    var allDataProject = await Project.findOne({
        where: {
            id: project.id,
        },
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
    });

    var data = allDataProject;

    console.log(socket);
    socket.getIO().then(io => io.to(`project:${allDataProject.id}`).emit('update', `project:${allDataProject.id}`, data));
}

module.exports = {
    updateUserData,
    updateOrganizationData,
    updateProjectData,
}