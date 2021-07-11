// Module to create api requests

import axios from 'axios';

class Api{
    constructor(props){
        this.state = {
            host: props.host,
            port: props.port,
            axios: axios.create({
                baseURL: `${props.host}:${props.port}`,
            }),
        };
    }

    async getToken(){
        return await localStorage.getItem("auth_token");
    }

    async request(options){
        // Create new http request using axios library with options provided
        var finalHeaders = {...options.headers, "Authorization": "Bearer "+await localStorage.getItem("auth_token"),};
        const response = await this.state.axios({method: options.method, url: options.path, data: options.payload, headers: finalHeaders, }).then((response) => {
            if(response.data){
                return {
                    success: true,
                    error: null,
                    data: response.data,
                }
            }else{
                return {
                    success: false,
                    error: null,
                    data: null,
                }
            }
        }).catch(error => {
            return {
                success: false,
                error: error.message,
                data: error.response.data ? error.response.data : null,
            }
        });

        return response;
    }
}

export default Api;