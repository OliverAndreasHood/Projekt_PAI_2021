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

const SocketUpdatesController = require('../controllers/SocketUpdatesController');

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
                attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
            });
        }catch(e){
            return false;
        }
    }else{
        return false;
    }
}

async function isMemberInOrganization(organization_id, user_id){
    // Check if user having id = user_id is a member in organization having id = organization_id
    return User.findOne({
        where: {
            id: user_id,
        },
        attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
        include: [{model: Organization, as: "MemberOrganizations", include: [{model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },}]}],
    }).then(async userModel => {
        if(userModel.MemberOrganizations && Array.isArray(userModel.MemberOrganizations) && userModel.MemberOrganizations.length > 0){
            var organizationToCheck = userModel.MemberOrganizations.find(x => x.id == organization_id);
            if(organizationToCheck){
                var check = await organizationToCheck.Members.find(x => x.id == user_id);
                if(check){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }).catch(error => {return false});
}

async function isMemberInProject(project_id, user_id){
    // Check if user having id = user_id is a member in project having id = project_id
    return User.findOne({
        where: {
            id: user_id,
        },
        attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
        include: [{model: Project, as: "MemberProjects", include: [{model: User, as: "Members", attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },}]}],
    }).then(async userModel => {
        if(userModel.MemberProjects && Array.isArray(userModel.MemberProjects) && userModel.MemberProjects.length > 0){
            var projectToCheck = userModel.MemberProjects.find(x => x.id == project_id);
            if(projectToCheck){
                var check = await projectToCheck.Members.find(x => x.id == user_id);
                if(check){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
    }).catch(error => {return false});
}

async function listAll(request, response, next){
    // Return all users
    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            User.findAll({ attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], }, }).then(data => response.json(data)).catch(error => {next(errorToReturn);});
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function me(request, response, next){
    // Return authenticated (using authorization token) user data

    var errorToReturn = new Error("Invalid token.");
    errorToReturn.status = 401;

    var user = await getUserByToken(request); // get authenticated user

    if(user){
        // Remove projects from MemberOrganizations returned with user (getUserByToken) who the user is not a member of
        for(var i=0; i<user.MemberOrganizations.length; i++){
            for(var x=0; x<user.MemberOrganizations[i].Projects.length; x++){
                var checkForMembershipInProject = await user.MemberOrganizations[i].Projects[x].Members.find(x => x.id == user.id);
                console.log(checkForMembershipInProject);
                if(checkForMembershipInProject == undefined || checkForMembershipInProject == null){
                    user.MemberOrganizations[i].Projects.splice(x, 1);
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

            response.json({
                user: user,
                allUsers: allUsers,
                allOrganizations: allOrganizations,
            });
        }else{
            response.json(user);
        }
    }else{ next(errorToReturn); }
}

async function login(request, response, next){
    // Issue an authorization token to the user after verifying email and password
    var obj = request.fields;

    var errorToReturn = new Error("Wrong Email or Password.");
    errorToReturn.status = 400;

    User.findOne({
        where: {
            email: obj.email,
        },
        attributes: { exclude: ['updated_at', 'created_at', 'email', ], },
    }).then(async userModel => {
        try{
            if(userModel !== undefined && userModel !== null){
                var isPasswordValid = await bcrypt.compare(obj.password, userModel.password); // Check provided password (plain text) with stored password (encrypted)
                if(isPasswordValid){ // If provided password matches to the stored hash
                    new Promise(function(resolve, reject){
                        try{
                            const token = jwt.sign({ sub: userModel.id, }, process.env.TOKEN_KEY, { expiresIn: '7d' }); // Create new authorization token
                            resolve(token);                
                        }catch(error){
                            reject(error);
                        }
                    }).then(token => response.json({token: token})).catch(error => {next(errorToReturn);});
                }else{
                    next(errorToReturn);
                }
            }else{
                next(errorToReturn);
            }
        }catch(error){
            next(errorToReturn);
        }
    }).catch(error => {next(errorToReturn);});
}

async function createUser(request, response, next){
    // Create new user
    var obj = request.fields;
    
    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        // If user is admin only then user can create another user
        if(user.type == "admin"){
            const salt = await bcrypt.genSalt(12);
            var encryptedPassword = await bcrypt.hash(obj.password, salt); // Encrypt provided password (plain text)

            User.create({
                first_name: obj.first_name,
                last_name: obj.last_name,
                email: obj.email,
                password: encryptedPassword, // store encrypted password in the database
                type: obj.type,
            }).then(data => {
                response.json({message: "User created sucessfully."});
                SocketUpdatesController.updateUserData(user); // Refresh user frontend data
            }).catch(error => {next(error);});
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function updateUser(request, response, next){
    // Update an existing user
    var obj = request.fields;
    var {id, ...objectWithoutId} = obj;

    var errorToReturn = new Error("An error occured");
    errorToReturn.status = 400;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            // If user is admin only then user can update another user
            if(objectWithoutId.type !== undefined && objectWithoutId.type !== null && typeof objectWithoutId.type === "string"){
                // If user type is being updated
                User.findOne({
                    where: {
                        id: obj.id,
                    },
                    attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
                    include: [{model: Organization, as: "ManagingOrganization"}],
                }).then(userModel => {
                    if(userModel.type == "manager"){
                        console.log(userModel);
                        userModel.ManagingOrganization.setManager(null).then(successData => { // If user who is being updated is a manager then remove him/her from the organization as a manager
                            User.update({ type: obj.type, }, {
                                where: {
                                    id: obj.id,
                                    type: "manager",
                                }
                            }).then(data => {
                                response.json({message: "User updated sucessfully."});
                                SocketUpdatesController.updateUserData(user); // Refresh user frontend data
                                SocketUpdatesController.updateUserData(userModel); // Refresh user (being updated) frontend data
                            }).catch(error => {next(error);});
                        }).catch(error => {next(error);});
                    }else{
                        User.update({ type: obj.type, }, {
                            where: {
                                id: obj.id,
                            }
                        }).then(data => {
                            response.json({message: "User updated sucessfully."});
                            SocketUpdatesController.updateUserData(user); // Refresh user frontend data
                            SocketUpdatesController.updateUserData(data); // Refresh user (being updated) frontend data
                        }).catch(error => {next(error);});
                    }
                }).catch(error => {next(error);});
            }else{
                // If something other than user type is being updated
                User.update(objectWithoutId, {
                    where: {
                        id: obj.id,
                    }
                }).then(data => {
                    response.json({message: "User updated sucessfully."});
                    SocketUpdatesController.updateUserData(user); // Refresh user frontend data
                    SocketUpdatesController.updateUserData(data); // Refresh user (being updated) frontend data
                }).catch(error => {next(error);});
            }
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function deleteUser(request, response, next){
    // Delete a user
    var obj = request.fields;

    var user = await getUserByToken(request);
    if(user){
        if(user.type == "admin"){
            // If user is admin only then user can delete another user
            User.findOne({
                where: {
                    id: obj.id,
                },
                attributes: { exclude: ['password', 'updated_at', 'created_at', 'email', ], },
            }).then(userModel => {
                userModel.destroy();
            }).then(data => {
                response.json({message: "User deleted sucessfully."});
                SocketUpdatesController.updateUserData(user); // Refresh user frontend data
            }).catch(error => {
                var errorToReturn = new Error("An error occured");
                errorToReturn.status = 400;
                next(errorToReturn);
            });
        }else{ next(errorToReturn); }
    }else{ next(errorToReturn); }
}

async function newAdmin(fn, ln, email, password){
    // Create new admin account
    // This function is not exposed to the public api and is only to be used locally on the server
    try{
        const salt = await bcrypt.genSalt(12);
        var encryptedPassword = await bcrypt.hash(password, salt);

        return await User.create({
            first_name: fn,
            last_name: ln,
            email: email,
            password: encryptedPassword,
            type: 'admin',
        }).then(data => {
            return "User created sucessfully.";
        }).catch(error => {
            return error;
        });
    }catch(error){
        return error;
    }
}

module.exports = {
    listAll,
    createUser,
    updateUser,
    deleteUser,
    login,
    me,
    isMemberInOrganization,
    isMemberInProject,
    newAdmin
}