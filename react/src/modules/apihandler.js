// Module to create api requests using api.js and handle them

import React, {Component} from 'react';
import Api from '../modules/api';
import MainContext from '../contexts/MainContext';

class ApiHandler extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            api: new Api(props.config),
        };
    }

    componentDidMount(){
        console.log(this.state.api);
    }

    async login(payload){
        // Login request
        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: "/user/login",
            payload: payload,
            headers: {},
        });

        return { success, error, data };
    }

    async user(payload){
        // User data (me) request
        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: "/user/me",
            payload: null,
            headers: {},
        });

        return { success, error, data };
    }

    async add(what, payload){
        // Adder request
        var whatFinal = what.toString().trim().toLowerCase();
        var payloadFinal = payload;

        console.log(whatFinal, payloadFinal);

        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: `${whatFinal == "card" || whatFinal == "column" ? '/project/' : ''}${whatFinal}/create`,
            payload: payloadFinal,
            headers: {},
        });

        return { success, error, data };
    }

    async assign(who, to, payload){
        // Assigner request
        var whatFinal = "";
        var payloadFinal = {};

        if(who == "User" && to == "Organization"){
            whatFinal = "/organization/member";

            payloadFinal = {
                id: payload.to_id,
                user_id: payload.who_id,
            };
        }

        if(who == "User" && to == "Project"){
            whatFinal = "/project/member";

            payloadFinal = {
                id: payload.to_id,
                user_id: payload.who_id,
            };
        }

        console.log(whatFinal, payloadFinal);

        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: `${whatFinal}/assign`,
            payload: payloadFinal,
            headers: {},
        });

        return { success, error, data };
    }

    async edit(what, payload){
        // Editor request
        var whatFinal = what.toString().trim().toLowerCase();
        var payloadFinal = payload;

        console.log(whatFinal, payloadFinal);

        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: `/${whatFinal}/update`,
            payload: payloadFinal,
            headers: {},
        });

        return { success, error, data };
    }

    async updateOrganizationManager(payload){
        // Manager update request
        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: "/organization/manager/update",
            payload: payload,
            headers: {},
        });

        return { success, error, data };
    }

    async delete(what, payload){
        // Delete request
        var whatFinal = what.toString().trim().toLowerCase();
        var payloadFinal = payload;

        console.log(whatFinal, payloadFinal);

        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: `/${whatFinal}/delete`,
            payload: payloadFinal,
            headers: {},
        });

        return { success, error, data };
    }

    async remove(what, payload){
        // Remove member request
        var whatFinal = what.toString().trim().toLowerCase();
        var payloadFinal = payload;

        console.log(whatFinal, payloadFinal);

        const { success, error, data } = await this.state.api.request({
            method: "post",
            path: `/${whatFinal}/remove`,
            payload: payloadFinal,
            headers: {},
        });

        return { success, error, data };
    }
}

export default ApiHandler;