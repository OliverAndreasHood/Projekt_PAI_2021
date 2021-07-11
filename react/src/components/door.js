// Door/Login Component

import React, {Component} from 'react';
import '../scss/door.scss';

import MainContext from '../contexts/MainContext';

class Door extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            display: this.props.display,
            email: "",
            password: "",
        };
    }

    componentDidMount(){
        console.log(this.context);
    }

    toggle(){
        // Toggle Component

        this.setState({
            display: this.state.display ? false : true,
        });
    }

    onButtonClick(){
        // Called when login button is clicked
        // Pass email and pass to onLogin function provided by dashboard as a callback

        this.props.onLogin(this.state.email, this.state.password);
    }

    emailChange(e){
        // Update email in state when input changed
        this.setState({
            ...this.state, 
            email: e.target.value,
        });
    }

    passwordChange(e){
        // Update password in state when input changed
        this.setState({
            ...this.state, 
            password: e.target.value,
        });
    }

    render(){
        return(
            this.state.display ? <div id="door">
                <div id="login">
                    <h1>Login</h1>
                    <input onChange={this.emailChange.bind(this)} value={this.state.email} type="text" maxLength="25" placeholder="Email"/>
                    <input onChange={this.passwordChange.bind(this)} value={this.state.password} type="password" maxLength="15" placeholder="Password"/>
                    <button onClick={this.onButtonClick.bind(this)}>Login</button>
                </div>
            </div> : <div></div>
        )
    }
}

export default Door;