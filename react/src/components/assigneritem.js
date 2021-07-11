// AssignerItem Component
// Assigner has multiple AssignerItem representing one assigner option obj

import React, {Component} from 'react';
import '../scss/manager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faPenSquare, faCheck, faUserCog } from '@fortawesome/fontawesome-free-solid';
import ThemeColors from '../scss/colors.js';

import MainContext from '../contexts/MainContext';

class AssignerItem extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            id: `assigner-item-radio-id-${Math.random()}`, // random id for assigner item
            current_assigned_to_id: null, // id of org or project to which user is currently assigned to
        };
    }

    async asyncSetup(){
        if(this.props.assignee_data.first_name){
            // user is being assigned
            if(this.context.user.type == "admin"){
                // to organization
                var current_assigned_to_id = null;

                if(this.props.assignee_data.MemberOrganizations && Array.isArray(this.props.assignee_data.MemberOrganizations) && this.props.assignee_data.MemberOrganizations.length > 0){
                    current_assigned_to_id = this.props.assignee_data.MemberOrganizations[0].id;
                }

                this.setState({
                    ...this.state,
                    current_assigned_to_id: current_assigned_to_id,
                });
            }else{
                if(this.context.user.type == "manager"){
                    // to project
                    var current_assigned_to_id = null;

                    if(this.context.active_organization.Projects && Array.isArray(this.context.active_organization.Projects) && this.context.active_organization.Projects.length > 0){
                        var projectsToCheck = this.context.active_organization.Projects;
                        for(var i=0; i<projectsToCheck.length; i++){
                            if(projectsToCheck[i].Members && Array.isArray(projectsToCheck[i].Members) && projectsToCheck[i].Members.length > 0){
                                for(var x=0; x<projectsToCheck[i].Members.length; x++){
                                    if(projectsToCheck[i].Members[x].id == this.props.assignee_data.id){
                                        // exists in this project
                                        current_assigned_to_id = projectsToCheck[i].id;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    this.setState({
                        ...this.state,
                        current_assigned_to_id: current_assigned_to_id,
                    });
                }
            }
        }
    }

    componentDidMount(){
        console.log(this.context);

        this.asyncSetup();
    }

    inputChange(e){
        // Call onClick callback provided by assigner on radio button (option) click
        this.props.onClick(e, this.props.data);
    }

    render(){
        return(
            <div className="assigner-item">
                <div className="radio-div">
                    <input name="assigner-radio" checked={this.props.data.id == this.state.current_assigned_to_id ? true : false} id={this.state.id} data-option={this.props.data.name} onChange={(e) => this.inputChange(e)} type="radio"></input>
                    <label for={this.state.id}>{this.props.data.name}</label>
                </div>
            </div>
        );
    }
}

export default AssignerItem;