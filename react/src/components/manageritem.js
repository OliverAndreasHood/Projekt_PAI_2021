// ManagerItem Component
// Manager has multiple ManagerItem representing one obj of data

import React, {Component} from 'react';
import '../scss/manager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faPenSquare, faCheck, faUserCog, faUser, faUserGraduate, faUserNinja, faUserSecret, faUserShield, faUserTie, faUserPlus } from '@fortawesome/fontawesome-free-solid';
import ThemeColors from '../scss/colors.js';

import MainContext from '../contexts/MainContext';

class ManagerItem extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            editing: false,
            value: this.props.data.name ? this.props.data.name : this.props.data.first_name && this.props.data.last_name ? `${this.props.data.first_name} ${this.props.data.last_name}` : "No Name",
            isAssigning: this.props.isAssigning,
            userTypeIcon: faUser,
            userType: this.props.data.type,
            isMemInProject: false,
            isMemInOrganization: false,
            canUpgradeUserMore: false, // can user be upgraded,
        };
    }

    async asyncSetup(){
        let type = this.state.userType;
        var isMemInProject = await this.context.functions.isUserMemberInProject(this.props.data);
        var isMemInOrganization = await this.context.functions.isUserMemberInOrganization(this.context.active_organization.id, this.props.data);


        // if a user is senior and the next role/type is manager and if there is already a manager in the active organization then user can not be updated until that manager is changed to another type/role.
        var canUpgradeUserMore = this.props.data.first_name ? (this.props.data.type == "senior" && this.context.active_organization.manager_id !== undefined && this.context.active_organization.manager_id !== null ? false : true) : false;

        console.log(isMemInProject);
        this.setState({
            ...this.state,
            canUpgradeUserMore: canUpgradeUserMore,
            isMemInProject: isMemInProject,
            isMemInOrganization: isMemInOrganization,
            userTypeIcon: type == "admin" ? faUserTie : type == "manager" ? faUserSecret : type == "student" ? faUserGraduate : type == "junior" ? faUserNinja : type == "mid" ? faUserPlus : type == "senior" ? faUserShield : faUser,
        });
    }

    componentDidMount(){
        console.log(this.context);

        this.asyncSetup();
    }

    toggleEdit(e){
        // Toggle edit input
        if(this.state.editing && this.state.value.trim().length <= 0){
            return false;
        }else{
            if(this.state.editing){
                // update

                if(this.props.data.first_name){
                    // user is being edited
                    var numberOfSpaces = this.state.value.split(" ").length-1;
                    if(numberOfSpaces !== 1){
                        // can not update, invalid first name and last name, only one space allowed and required
                    }else{
                        this.props.onEdit(e, {
                            first_name: this.state.value.split(" ")[0], 
                            last_name: this.state.value.split(" ")[1],
                        }, this.props.data);

                        this.setState({
                            ...this.state,
                            editing: false,
                        });
                    }
                }else{
                    // org and project
                    this.props.onEdit(e, {
                        name: this.state.value,
                    }, this.props.data);

                    this.setState({
                        ...this.state,
                        editing: false,
                    });
                }
            }else{
                // about to update
                this.setState({
                    ...this.state,
                    editing: true,
                });
            }
        }
    }

    inputChange(e){
        // Update edit input value in state
        this.setState({
            ...this.state,
            value: e.target.value,
        });
    }

    async changeUserType(e){
        // Upgrade user to next type/role
        var types = ["student", "junior", "mid", "senior", "manager",];
        var newIndex = await types.findIndex(x => x == this.state.userType);

        if(newIndex >= types.length-1){
            newIndex = 0;
        }else{
            newIndex = newIndex + 1;
        }

        var newType = await types[newIndex];

        // Call onUserTypeChange callback provided by manager to this manageritem
        await this.props.onUserTypeChange(e, newType, this.props.data.type, this.props.data);

        this.setState({
            ...this.state,
            userType: newType,
            userTypeIcon: newType == "admin" ? faUserTie : newType == "manager" ? faUserSecret : newType == "student" ? faUserGraduate : newType == "junior" ? faUserNinja : newType == "mid" ? faUserPlus : newType == "senior" ? faUserShield : faUser,
        });
    }

    async onDelete(e){
        // Call onDelete callback provided by manager to this manageritem
        await this.props.onDelete(e, {id: this.props.data.id,});
    }

    async onRemove(e){
        // Call onRemove callback provided by manager to this manageritem
        await this.props.onRemove(e, {id: this.props.data.id, });
    }

    render(){
        return(
            <div className="manager-item">
                {this.state.editing ? <div><input onChange={(e) => this.inputChange(e)} type="text" style={{marginBottom: "0px",}} placeholder="Name" value={this.state.value}></input></div> : <div><h5>{this.state.value}</h5></div>}
                <div>
                    {this.props.allowUserTypeChanging && !this.state.editing && !this.state.isAssigning && this.state.isMemInOrganization && this.state.canUpgradeUserMore ? <span onClick={this.state.userType == "admin" ? () => {} : this.changeUserType.bind(this)} title={`${this.state.userType} ${this.state.userType == "admin" ? "" : "(Click To Change User Type)"}`}><FontAwesomeIcon icon={this.state.userTypeIcon} color={`#${ThemeColors()[4].hex}`}></FontAwesomeIcon></span> : false}
                    {this.props.allowDeleting && !this.state.editing && !this.state.isAssigning ? <span onClick={this.onDelete.bind(this)} title={"Delete"}><FontAwesomeIcon icon={faTrash} color={`#${ThemeColors()[1].hex}`}></FontAwesomeIcon></span> : false}
                    {this.props.allowRemoving && !this.state.editing && !this.state.isAssigning && this.state.isMemInProject ? <span onClick={this.onRemove.bind(this)} title={"Remove User From Project"}><FontAwesomeIcon icon={faTimes} color={`#${ThemeColors()[1].hex}`}></FontAwesomeIcon></span> : false}
                    {this.props.allowEditing && !this.state.isAssigning ? <span onClick={this.toggleEdit.bind(this)} title={this.state.editing ? "Confirm Edits" : "Edit"}><FontAwesomeIcon icon={this.state.editing ? faCheck : faPenSquare} color={this.state.editing ? "darkgreen" : `#${ThemeColors()[2].hex}`}></FontAwesomeIcon></span> : false}
                    {this.props.allowAssigning && !this.state.editing ? <span onClick={(e) => this.props.onToggleAssigner(e, this.props.data)} title={`(Re)Assign To ${this.context.user.type == "admin" ? "Organization" : "Project"}`}><FontAwesomeIcon icon={faUserCog} color={`#${ThemeColors()[3].hex}`}></FontAwesomeIcon></span> : false}
                </div>
            </div>
        );
    }
}

export default ManagerItem;