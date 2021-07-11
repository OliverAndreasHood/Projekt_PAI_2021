// Module for handling socket.io connections

require('dotenv').config();
const socketIo = require("socket.io");
const jwtAuth = require('socketio-jwt-auth');
const User = require("./database/models/User");
const Organization = require("./database/models/Organization");
const Project = require("./database/models/Project");

async function isMemberInOrganization(organization_id, user_id){
    // Check if user having id = user_id is a member in organization having id = organization_id
    return User.findOne({
        where: {
            id: user_id,
        },
        include: [{model: Organization, as: "MemberOrganizations", include: [{model: User, as: "Members",}]}],
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
        include: [{model: Project, as: "MemberProjects", include: [{model: User, as: "Members",}]}],
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

var io = null; // var to which socket instance is assigned on setupIO()

async function getIO(){
    // Return io
    return io;
}

async function setupIO(server){
    io = await socketIo(server, {
        cors: {
            origin: '*',
        }
    });


    // socket middleware for authenticating user using the provided authorization token in the request
    io.use(jwtAuth.authenticate({ secret: process.env.TOKEN_KEY, algorithm: 'HS256'}, function(payload, done) {
            User.findOne({
                where: {
                    id: payload.sub, // user_id encoded in the token
                },
                attributes: {
                    exclude: ['password', 'updated_at', 'created_at', 'email', ],
                },
            }).then(user => {
                if(!user){
                    return done(null, false, 'User does not exists'); // if user does not exists (disallow connection)
                }

                return done(null, user); // if user exists pass user to other socket events (connection,disconnect,subscribe etc.)
            });
        }
    ));

    io.on('connection', function (socket) {
        // User connected after authenticating using correct token

        console.log(`hello! ${socket.request.user.first_name}`);

        socket.on('subscribe',async function(room) {
            // When subscribe is called from the frontend, subscribe a user from a channel/room if possible
            // Room/channel names are in format : (model:model_id) eg: user:1, organization:10, project:200

            var user = socket.request.user; // user returned from the socket authentication middleware

            if(room.includes("user")){
                // joining user channel

                if(room === `user:${user.id}`){
                    console.log('joining room', room);
                    socket.join(room);
                    console.log('joined room', room);

                    return "subscribed";
                }else{ console.log('Can not join room', room); return "can not subscribe"; }
            }else{
                if(room.includes("organization")){
                    // joining organization channel
                    var canJoinRoom = await isMemberInOrganization(room.split(":")[1], user.id);

                    if(canJoinRoom){
                        console.log('joining room', room);
                        socket.join(room);
                        console.log('joined room', room);

                        return "subscribed";
                    }else{ console.log('Can not join room', room); return "can not subscribe"; }
                }else{
                    if(room.includes("project")){
                        // joining project channel
                        var canJoinRoom = await isMemberInProject(room.split(":")[1], user.id);

                        if(canJoinRoom){
                            console.log('joining room', room);
                            socket.join(room);
                            console.log('joined room', room);

                            return "subscribed";
                        }else{ console.log('Can not join room', room); return "can not subscribe"; }
                    }
                }
            }
        });

        socket.on('unsubscribe', function(room) {  
            // When unsubscribe is called from the frontend, unsubscribe a user from a channel/room
            console.log('leaving room', room);
            socket.leave(room);
            console.log('left room', room);

            return "unsubscribed";
        });

        socket.on('disconnect', function(e) {
            // When disconnect is called from the frontend
            console.log("disconnected", e);

            return "disconnected";
        });
    });

    return true;
}

module.exports = {
    io,
    setupIO,
    getIO,
}