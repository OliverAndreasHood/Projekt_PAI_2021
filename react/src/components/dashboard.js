// Dashboard Component

import React, {Component} from 'react';
import Kanban from '../components/kanban';
import '../scss/dashboard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorOpen, faArrowsAlt, faCheck, faUsers, faSitemap, faProjectDiagram } from '@fortawesome/fontawesome-free-solid';
import Door from '../components/door';
import Adder from '../components/adder';
import Manager from '../components/manager';

import MainContext from '../contexts/MainContext';

class Dashboard extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            display: props.display, // display dashboard or not
            dragColumns: false, // = to context.booleans.moveColumns
            data: props.data, // data passed from context.provider on app.js
            adder: { // adder data obj
                what: "",
                add: this.adderAdd.bind(this),
                cancel: this.adderCancel.bind(this),
                toggle: this.adderToggle.bind(this),
                display: false,
                kanban_column_id: null,
            },
            manager: { // manager data obj
                what: "",
                display: false,
                cancel: this.managerCancel.bind(this),
                toggle: this.managerToggle.bind(this),
                data: [],
            },
        };

        console.log(props);
    }

    componentWillMount(){
        this.context.functions.fetchUser();
    }

    componentDidMount(){
        console.log(this.context);

        this.setState({
            ...this.state,
            dragColumns: this.context.booleans.moveColumns,
        });
    }

    async adderAdd(e, values, what){
        // Called on adder button click

        //console.log(e, values, what);

        if(what == "card"){
            values.id = this.state.adder.kanban_column_id;
            values.kanban_id = this.context.active_project.Kanban.id;
        }

        if(what == "project"){
            values.organization_id = this.context.active_organization.id;
        }

        if(what == "column"){
            values.id = this.context.active_project.Kanban.id;
        }

        // Create adder request to api
        var { success, error, data } = await this.context.api.add(what, values);
        console.log(success, error, data);

        // Hide adder
        this.setState({
            ...this.state,
            adder: {
                ...this.state.adder,
                display: false,
            },
        });
    }

    adderCancel(e){
        // Hide adder

        //console.log(e);
        this.setState({
            ...this.state,
            adder: {
                ...this.state.adder,
                display: false,
            },
        });
    }

    adderToggle(what, where = null, data){
        // Toggle adder

        this.setState({
            ...this.state,
            adder: {
                ...this.state.adder,
                display: this.state.adder.display ? false : true,
                what: what,
                kanban_column_id: !this.state.adder.display && data && data.kanban_column_id ? data.kanban_column_id : null, // kanban_column_id is passed in data when adder is initiated to create a card, by clicking on add new card component, to reference the column in which card is being added
            },
        });
    }

    managerCancel(e){
        // Hide manager

        //console.log(e);
        this.setState({
            ...this.state,
            manager: {
                ...this.state.manager,
                display: false,
            },
        });
    }

    managerToggle(what, data){
        // Manager toggle

        this.setState({
            ...this.state,
            manager: {
                ...this.state.manager,
                display: this.state.manager.display ? false : true,
                what: what,
                data: data,
            },
        });
    }

    async changeActiveOrganization(){
        // Change active organization to next organization in manageable organizations array
        // Called when organization name clicked on dashboard

        if(this.context.user.type == "admin"){
            if(this.context.allOrganizations.length > 1){
                var currentIndex = await this.context.allOrganizations.findIndex(x => x.id == this.context.active_organization.id);

                var newIndex = (currentIndex + 1) % this.context.allOrganizations.length;

                var newOrg = await this.context.allOrganizations[newIndex];

                console.log(newIndex, newOrg);

                this.context.functions.updateActiveOrganization(newOrg);

                if(newOrg.Projects && Array.isArray(newOrg.Projects) && newOrg.Projects.length > 0){
                    this.context.functions.updateActiveProject(newOrg.Projects[0]);
                }else{
                    this.context.functions.updateActiveProject({name: "No Project"});
                }
            }
        }
    }

    async changeActiveProject(){
        // Change active project to next project in manageable projects array
        // Called when project name clicked on dashboard

        if(this.context.active_organization && this.context.active_organization.Projects && Array.isArray(this.context.active_organization.Projects) && this.context.active_organization.Projects.length > 1){
            var currentIndex = await this.context.active_organization.Projects.findIndex(x => x.id == this.context.active_project.id);

            var newIndex = (currentIndex + 1) % this.context.active_organization.Projects.length;

            var newProject = await this.context.active_organization.Projects[newIndex];

            console.log(newIndex, newProject);

            this.context.functions.updateActiveProject(newProject);
        }
    }


    render(){
        return(
            this.context.booleans.isLoggedIn == false ? <Door display={this.context.booleans.isLoggedIn ? false : true} onLogin={this.context.functions.onLogin}></Door> : this.context.booleans.isLoggedIn && this.context.booleans.userFetched && this.context.booleans.userReady ? <div id="dashboard">
                <div title="Your Name" id="username"><h6>{this.context.user.first_name && this.context.user.last_name ? `${this.context.user.first_name} ${this.context.user.last_name.charAt(0)}` : "No Name"}</h6></div>
                <div onClick={() => this.changeActiveOrganization()} title="Active Organization" id="organization"><h6>{this.context.active_organization.name}</h6></div>
                <div onClick={() => this.changeActiveProject()} title="Active Project" id="project"><h6>{this.context.active_project.name}</h6></div>
                <span title={this.context.booleans.moveColumns ? "Confirm Column Positions" : "Enable Column Dragging"} id="columns" onClick={this.context.functions.toggleMoveColumns}><FontAwesomeIcon color={"black"} icon={this.context.booleans.moveColumns ? faCheck : faArrowsAlt} /></span>
                {this.context.user.type == "admin" || this.context.user.type == "manager" ? <span title="Manage Users" id="users" onClick={() => this.state.manager.toggle("Users", this.context.manageableUsers)}><FontAwesomeIcon color={"black"} icon={faUsers} /></span> : false}
                {this.context.user.type == "admin" ? <span title="Manage Organizations" id="organizations" onClick={() => this.state.manager.toggle("Organizations", this.context.manageableOrganizations)}><FontAwesomeIcon color={"black"} icon={faSitemap} /></span> : false}
                {this.context.user.type == "manager" ? <span title="Manage Projects" id="projects" onClick={() => this.state.manager.toggle("Projects", this.context.manageableProjects)}><FontAwesomeIcon color={"black"} icon={faProjectDiagram} /></span> : false}
                <span title="Logout" id="logout" onClick={this.context.functions.onLogout}><FontAwesomeIcon color={"black"} icon={faDoorOpen} /></span>
                {[this.context.active_project.Kanban].map(kanban => <Kanban onAddStart={(what, where, data) => this.state.adder.toggle(what, where, data)} dragColumns={this.context.booleans.moveColumns}></Kanban>)}
                <Adder key={`adder-display-key=${this.state.adder.display}`} display={this.state.adder.display} addingWhat={this.state.adder.what} onCancel={this.state.adder.cancel} onAdd={this.state.adder.add}></Adder>
                <Manager data={this.state.manager.what == "Projects" ? this.context.manageableProjects : this.state.manager.what == "Organizations" ? this.context.manageableOrganizations : this.state.manager.what == "Users" ? this.context.manageableUsers : []} toggleAdder={this.state.adder.toggle} key={`manager-display-key=${this.state.manager.display}`} display={this.state.manager.display} managingWhat={this.state.manager.what} onCancel={this.state.manager.cancel} onAdd={this.state.manager.add} onRemove={this.state.manager.remove} onDelete={this.state.manager.delete}></Manager>
            </div> : <div></div>
        )
    }
}

export default Dashboard;