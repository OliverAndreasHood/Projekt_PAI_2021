// Manager Component

import React, {Component} from 'react';
import '../scss/manager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ManagerItem from '../components/manageritem';
import Assigner from '../components/assigner';

import MainContext from '../contexts/MainContext';

class Manager extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            display: this.props.display,
            allowRemoving: false,
            allowDeleting: false,
            allowEditing: false,
            allowAdding: false,
            allowAssigning: false,
            allowUserTypeChanging: false,
            assigner: { // assigner data obj
                display: false,
                assigningWhat: this.props.managingWhat.slice(0, -1),
                assigningWhatObj: null,
                assigningTo: "",
                options: [],
                value: null,
            },
        };
    }

    componentDidMount(){
        console.log(this.context);

        // Set dynamic capabilities and data according to the logged in user's role/type
        this.setState({
            ...this.state,
            assigner:{
                ...this.state.assigner,
                // Options to show in assigner according to what is being managed
                options: (["Users"].includes(this.props.managingWhat) && this.context.user.type == "admin") ? this.context.allOrganizations : (["Users"].includes(this.props.managingWhat) && this.context.user.type == "manager") ? this.context.active_organization.Projects : [],
                assigningTo: (["Users"].includes(this.props.managingWhat) && this.context.user.type == "admin") ? "Organization" : (["Users"].includes(this.props.managingWhat) && this.context.user.type == "manager") ? "Project" : "",
            },
            // Capabilities of user according to their role and what is being managed
            allowUserTypeChanging: this.context.user.type == "admin" && ["Users"].includes(this.props.managingWhat) ? true : false,
            allowRemoving: this.context.user.type == "manager" && ["Users"].includes(this.props.managingWhat) ? true : false,
            allowDeleting: (this.context.user.type == "admin" && ["Users", "Organizations"].includes(this.props.managingWhat)) || (this.context.user.type == "manager" && ["Projects"].includes(this.props.managingWhat)) ? true : false,
            allowEditing: (this.context.user.type == "admin" && ["Users", "Organizations"].includes(this.props.managingWhat)) || (this.context.user.type == "manager" && ["Projects"].includes(this.props.managingWhat)) ? true : false,
            allowAdding: (this.context.user.type == "admin" && ["Users", "Organizations"].includes(this.props.managingWhat)) || (this.context.user.type == "manager" && ["Projects"].includes(this.props.managingWhat)) ? true : false,
            allowAssigning: (this.context.user.type == "admin" && ["Users",].includes(this.props.managingWhat)) || (this.context.user.type == "manager" && ["Users"].includes(this.props.managingWhat)) ? true : false,
        });
    }

    componentDidUpdate(){
        console.log(this.state.assigner);
    }

    toggle(){
        // Toggle
        
        this.setState({
            display: this.state.display ? false : true,
        });
    }

    toggleAssigner(e, assigningWhatObj){
        // Assigner Toggle

        this.setState({
            ...this.state,
            assigner: {
                ...this.state.assigner,
                display: this.state.assigner.display ? false : true,
                assigningWhat: this.state.assigner.assigningWhat,
                assigningWhatObj: assigningWhatObj ? assigningWhatObj : null,
                assigningTo: this.state.assigner.assigningTo,
                options: this.state.assigner.options,
                value: this.state.assigner.value,
            },
        });
    }

    toggleAdder(){
        // Adder Toggle

        var what = ["Users", "Organizations", "Projects"].includes(this.props.managingWhat) ? this.props.managingWhat.slice(0, -1) : what; // What is being added, pass what is being managed removed last character from it (s)
        this.props.toggleAdder(what);
    }

    async onAssignerChange(e, data = null){
        // Called when assigned

        //console.log(data, this.state.assigner.assigningWhatObj);
        var assigningWhatObj = this.state.assigner.assigningWhatObj;

        var who = this.state.assigner.assigningWhat;
        var to = this.state.assigner.assigningTo;

        if(data && assigningWhatObj){
            if(who == "User" && to == "Organization"){

                // Create assign request
                var { success, error, data } = await this.context.api.assign(who, to, { who_id: assigningWhatObj.id, to_id: data.id, });
                console.log(success, error, data);

                // Hide assigner and set it's obj info to default
                this.setState({
                    ...this.state,
                    assigner: {
                        ...this.state.assigner,
                        display: false,
                        assigningWhat: this.props.managingWhat.slice(0, -1),
                        assigningWhatObj: null,
                        assigningTo: "",
                        options: [],
                        value: null,
                    },
                });
            }else{
                if(who == "User" && to == "Project"){

                    // Create assign request
                    var { success, error, data } = await this.context.api.assign(who, to, { who_id: assigningWhatObj.id, to_id: data.id, });
                    console.log(success, error, data);

                    // Hide assigner and set it's obj info to default
                    this.setState({
                        ...this.state,
                        assigner: {
                            ...this.state.assigner,
                            display: false,
                            assigningWhat: this.props.managingWhat.slice(0, -1),
                            assigningWhatObj: null,
                            assigningTo: "",
                            options: [],
                            value: null,
                        },
                    });
                }
            }
        }
    }

    async onEdit(e, editedValues, editedObj){
        // Called when edit confirmed
        // editedObj is the object being edited for data references eg user, org, project
        //console.log(e, editedValues, editedObj);

        var managingWhat = this.props.managingWhat;
        if(managingWhat == "Users"){
            // Create edit request
            var { success, error, data } = await this.context.api.edit("user", { id: editedObj.id, first_name: editedValues.first_name, last_name: editedValues.last_name, });
            console.log(success, error, data);

            return true;
        }else{
            if(managingWhat == "Organizations" || managingWhat == "Projects"){
                // Create edit request
                var { success, error, data } = await this.context.api.edit(managingWhat.toLowerCase().trim().slice(0, -1), { id: editedObj.id, name: editedValues.name, });
                console.log(success, error, data);

                return true;
            }
        }
    }

    async onUserTypeChange(e, to, from, editedObj){
        // Called when user type upgraded/changed
        //console.log(e, to, from, editedObj);

        if(to.toLowerCase() == "manager" && from.toLowerCase() !== "manager"){
            // If upgraded to manager of the active organization then make a manager update request
            var { success, error, data } = await this.context.api.updateOrganizationManager({ id: this.context.active_organization.id, user_id: editedObj.id });
            console.log(success, error, data);

            return true;
        }else{
            // If not upgraded to manager of the active organization then make a simple update request
            var { success, error, data } = await this.context.api.edit("user", { id: editedObj.id, type: to, });
            console.log(success, error, data);

            return true;
        }
    }

    async onDelete(e, values){
        // Called when deleted
        //console.log(this.props.managingWhat.toLowerCase().trim().slice(0, -1), values);

        // Create delete request
        var { success, error, data } = await this.context.api.delete(this.props.managingWhat.toLowerCase().trim().slice(0, -1), values);
        console.log(success, error, data);

        return true;
    }

    async onRemove(e, values){
        // Called when removed
        //console.log(this.props.managingWhat.toLowerCase().trim().slice(0, -1), values);

        // Create remove request
        var { success, error, data } = await this.context.api.remove("project/member", { id: this.context.active_project.id, user_id: values.id, });
        console.log(success, error, data);

        return true;
    }

    render(){
        return(
            this.state.display && this.context.booleans.userReady ? <div id="manager">
                <h4>Manage {this.props.managingWhat}</h4>
                <div id="manager-items">{Array.isArray(this.props.data) && this.props.data.length > 0 ? this.props.data.map(x => <ManagerItem onRemove={this.onRemove.bind(this)} onEdit={this.onEdit.bind(this)} onDelete={this.onDelete.bind(this)} onUserTypeChange={this.onUserTypeChange.bind(this)} allowUserTypeChanging={this.state.allowUserTypeChanging} isAssigning={this.state.assigner.display} onToggleAssigner={this.toggleAssigner.bind(this)} allowDeleting={this.state.allowDeleting} allowRemoving={this.state.allowRemoving} allowEditing={this.state.allowEditing} allowAssigning={this.state.allowAssigning} data={x}></ManagerItem>) : false}</div>
                {this.state.allowAdding ? <button style={{marginTop: "20px",}} onClick={() => this.toggleAdder()}>Add New</button> : false}
                {this.state.assigner.display ? <Assigner onAssignerChange={this.onAssignerChange.bind(this)} options={this.state.assigner.options} assigningTo={this.state.assigner.assigningTo} assigningWhat={this.state.assigner.assigningWhat} assigningWhatObj={this.state.assigner.assigningWhatObj} display={this.state.assigner.display}></Assigner> : false}
                <button onClick={this.props.onCancel}>Cancel</button>
            </div> : <div></div>
        )
    }
}

export default Manager;