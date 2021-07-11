// Module used to handle socket.io connection with backend

import React, {Component} from 'react';
import { io } from "socket.io-client";

class SocketHandler extends Component{
    constructor(props){
        super(props);
        this.state = {
            host: props.host,
            port: props.port,
            token: props.token,
            socket: io.connect(`${props.host}:${props.port}`, { // socket io instance
                extraHeaders: {
                    'x-auth-token': props.token,
                },
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            'x-auth-token': props.token,
                        },
                    },
                },
            }),
        };
    }

    async getToken(){
        return await localStorage.getItem("auth_token");
    }

    async subscribe(room){
        // Subscribe to a room/channel
        await this.state.socket.emit('subscribe', room);
        return true;
    }

    async unsubscribe(room){
        // Unsubscribe from a room/channel
        await this.state.socket.emit('unsubscribe', room);
        return true;
    }

    async setupListeners(callbacks){
        // Setup event listeners
        // Which are fired when backend fires those events

        // Do this when backend fires 'update' event
        this.state.socket.on('update', function (room, data) {
            console.log('update!', room, data);

            if(room.includes("user")){
                callbacks.update.user(data); // Update user data
            }else{
                if(room.includes("organization")){
                    callbacks.update.organization(data); // Update organization data
                }else{
                    if(room.includes("project")){
                        callbacks.update.project(data); // Update project data
                    }
                }
            }
        });

        return true;
    }

    async restart(){
        // Restart socket connection
        await this.state.socket.close();
        await this.state.socket.disconnect();
        await this.state.socket.connect(`${this.state.host}:${this.state.port}`, { // socket io instance
            extraHeaders: {
                'x-auth-token': await localStorage.getItem("auth_token"),
            },
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'x-auth-token': await localStorage.getItem("auth_token"),
                    },
                },
            },
        });
        return true;
    }

    async disconnect(){
        // Disconnect socket connection
        await this.state.socket.removeAllListeners();
        await this.state.socket.disconnect();
        await this.state.socket.close();
        console.log("disconnected from socket");
        return true;
    }
}

export default SocketHandler;