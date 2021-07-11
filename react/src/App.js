// Module for rendering the application

import React, {Component, createContext, useState, useEffect} from 'react';

import Dashboard from './components/dashboard';
import Door from './components/door';
import ApiHandler from './modules/apihandler';
import SocketHandler from './modules/sockethandler';

import MainContext from './contexts/MainContext';

class App extends Component {
  constructor(props){
    super(props);

    // State is used to store information inside a Component
    // Component refreshes everytime State is updated/changed

    this.state = {
      api: new ApiHandler({config: {host: "http://localhost", port: 3001, },}), // Api Handler for handling api requests
      socket: null, // Socket Handler for handling socket events/requests
      allUsers: [], // All users array for admin user
      allOrganizations: [], // All organizations array for admin user
      active_organization: {name: "No Organization"}, // Active organization object
      active_project: {name: "No Project"}, // Active project object
      booleans: {
        isLoggedIn: false, // Is user logged in
        moveColumns: false, // Can used move columns
        userFetched: false, // Is user data fetched from api
        userReady: false, // Is state updated with user data
        isMemInProject: false, // Is user member in active project
        IsMemInOrg: false, //  Is user member in active organization
      },
      functions: { // Functions exported
        fetchUser: this.fetchUser.bind(this),
        onLogin: this.onLogin.bind(this),
        onLogout: this.onLogout.bind(this),
        toggleMoveColumns: this.toggleMoveColumns.bind(this),
        updateKanbanColumnsFrontEnd: this.updateKanbanColumnsFrontEnd.bind(this),
        updateActiveOrganization: this.updateActiveOrganization.bind(this),
        updateActiveProject: this.updateActiveProject.bind(this),
        isUserMemberInOrganization: this.isUserMemberInOrganization.bind(this),
        isUserMemberInProject: this.isUserMemberInProject.bind(this),
      },
    }
  }

  componentDidUpdate(){
    console.log(this.state);
  }

  async userDataUpdate(data){
    // Update user data to data received from socket update
    console.log("new user data", data);

    if(this.state.user.type == "admin"){
      await this.setState({
        ...this.state,
        user: data.user,
        allUsers: data.allUsers,
        allOrganizations: data.allOrganizations,
        booleans: {
          ...this.state.booleans,
          userReady: false,
        },
      });

      this.readyUser();
    }else{
      await this.setState({
        ...this.state,
        user: data,
        booleans: {
          ...this.state.booleans,
          userReady: false,
        },
      });

      this.readyUser();
    }
  }

  async organizationDataUpdate(data){
    // Update organization data to data received from socket update
    console.log("new org data", data);

    if(this.state.user.type == "admin"){
      // If user is admin, update this.state.allOrganizations
      var organizationsToChange = this.state.allOrganizations;
      var newOrgArr = organizationsToChange.filter(x => x.id !== data.id); // Remove old data of updated organization
      newOrgArr.push(data); // Push new data of updated organization received from socket
 
      console.log(this.state.allOrganizations, 'to', newOrgArr);

      await this.setState({
        ...this.state,
        allOrganizations: newOrgArr,
        booleans: {
          ...this.state.booleans,
          userReady: false,
        },
      });

      this.readyUser();
    }else{
      if(this.state.user.type == "manager"){
        // If user is manager, update this.state.user.ManagingOrganization
        if(this.state.user.ManagingOrganization && this.state.user.ManagingOrganization.id == data.id){
          // If updated organization is the ManagingOrganization then update the ManagingOrganization
          await this.setState({
            ...this.state,
            user: {
              ...this.state.user,
              ManagingOrganization: data, // New data of updated organization received from socket
            },
            booleans: {
              ...this.state.booleans,
              userReady: false,
            },
          });
        }

        // update this.state.user.MemberOrganizations
        var organizationsToChange = this.state.user.MemberOrganizations;
        var newOrgArr = organizationsToChange.filter(x => x.id !== data.id); // Remove old data of updated organization
        newOrgArr.push(data); // Push new data of updated organization received from socket

        await this.setState({
          ...this.state,
          user: {
            ...this.state.user,
            MemberOrganizations: newOrgArr,
          },
          booleans: {
            ...this.state.booleans,
            userReady: false,
          },
        });

        this.readyUser();
      }else{
        // update this.state.user.MemberOrganizations
        var organizationsToChange = this.state.user.MemberOrganizations;
        var newOrgArr = organizationsToChange.filter(x => x.id !== data.id); // Remove old data of updated organization
        newOrgArr.push(data); // Push new data of updated organization received from socket

        await this.setState({
          ...this.state,
          user: {
            ...this.state.user,
            MemberOrganizations: newOrgArr,
          },
          booleans: {
            ...this.state.booleans,
            userReady: false,
          },
        });

        this.readyUser();
      }
    }
  }

  async projectDataUpdate(data){
    console.log("new project data", data);
    // haven't used this function, left for future.
    // Can be used to update project data to data received from socket
  }

  async setupSocket(){
    // Setup socket.io client
    var token = await localStorage.getItem("auth_token");
    this.setState({
      ...this.state,
      socket: new SocketHandler({host: "http://localhost", port: 3001, token: token, }),
    });

    await setTimeout(async () => {
      //await this.state.socket.restart(); // Restart socket connection
      await this.state.socket.setupListeners({ // Setup event listeners which listen to updates from server
        update: {
          user: this.userDataUpdate.bind(this), // callback to call when user data is updated
          organization: this.organizationDataUpdate.bind(this), // callback to call when organization data is updated
          project: this.projectDataUpdate.bind(this), // callback to call when project data is updated
        },
      });

      await this.state.socket.subscribe(`user:${this.state.user.id}`); // Join user room/channel (user's own room/channel)

      if(this.state.user.ManagingOrganization){
        await this.state.socket.subscribe(`organization:${this.state.user.ManagingOrganization.id}`); // Join ManagingOrganization room/channel

        for(var x=0; x<this.state.user.ManagingOrganization.Projects.length; x++){
          await this.state.socket.subscribe(`project:${this.state.user.ManagingOrganization.Projects[x].id}`); // Join ManagingOrganization's Projects' rooms/channels
        }
      }

      for(var i=0; i<this.state.user.MemberOrganizations.length; i++){
        if(this.state.user.ManagingOrganization && this.state.user.ManagingOrganization.id == this.state.user.MemberOrganizations[i].id){
          // If current MemberOrganization is ManagingOrganization then skip because user already joined the ManagingOrganization room/channel
        }else{
          await this.state.socket.subscribe(`organization:${this.state.user.MemberOrganizations[i].id}`); // Join MemberOrganization room/channel

          for(var x=0; x<this.state.user.MemberOrganizations[i].Projects.length; x++){
            await this.state.socket.subscribe(`project:${this.state.user.MemberOrganizations[i].Projects[x].id}`); // Join MemberOrganization's Projects' rooms/channels
          }
        }
      }

      return true;
    }, 1000);
  }

  async getActiveOrganization(){
    // Return organization which should be set to active organization
    // This function is called on login or after data update

    var active_organization = this.state.active_organization; // get current active organization
    var switchToActOrg = false;
    if(active_organization && active_organization.id !== undefined && active_organization.id !== null){
      // if there is an active org then switch the active organization to the current active organization if it exists in new organizations data
      switchToActOrg = true;
    }

    var user = this.state.user;
    if(user.type == "admin"){
      if(this.state.allOrganizations && Array.isArray(this.state.allOrganizations) && this.state.allOrganizations.length > 0){
        var doesActOrgExistsOnNewArr = switchToActOrg ? this.state.allOrganizations.find(x => {return x.id == active_organization.id}) : false;
        if(switchToActOrg && doesActOrgExistsOnNewArr){ return doesActOrgExistsOnNewArr; }else{
          return this.state.allOrganizations[0];
        }
      }
      return {name: "No Organization"};
    }else{
      if(user.type == "manager"){
        if(user.ManagingOrganization){ return user.ManagingOrganization; }
        if(user.MemberOrganizations && Array.isArray(user.MemberOrganizations) && user.MemberOrganizations.length > 0){
          var doesActOrgExistsOnNewArr = switchToActOrg ? user.MemberOrganizations.find(x => {return x.id == active_organization.id}) : false;
          if(switchToActOrg && doesActOrgExistsOnNewArr){ return doesActOrgExistsOnNewArr; }else{
            return user.MemberOrganizations[0];
          }
        }
        return {name: "No Organization"};
      }else{
        if(user.MemberOrganizations && Array.isArray(user.MemberOrganizations) && user.MemberOrganizations.length > 0){
          var doesActOrgExistsOnNewArr = switchToActOrg ? user.MemberOrganizations.find(x => {return x.id == active_organization.id}) : false;
          return switchToActOrg && doesActOrgExistsOnNewArr ? doesActOrgExistsOnNewArr : user.MemberOrganizations[0];
        }else{
          return {name: "No Organization"};
        }
      }
    }
  }

  async isUserMemberInOrganization(id, user){
    // Used to check if user is member in organization having id = id
    if(user){
      var organizationsToCheck = [];

      if(user.type == "admin"){ organizationsToCheck = this.state.allOrganizations; }
      if(user.type !== "admin"){ 
        if(user.type == "member" && user.ManagingOrganization){
          organizationsToCheck.push(user.ManagingOrganization);
        }
        
        if(user.MemberOrganizations && Array.isArray(user.MemberOrganizations) && user.MemberOrganizations.length > 0){
          for(var i=0; i<user.MemberOrganizations.length; i++){ organizationsToCheck.push(user.MemberOrganizations[i]); }
        }
      }

      var organizationToCheck = organizationsToCheck.find(x => {return x.id == id});
      console.log(organizationToCheck);
      if(organizationToCheck){
        if(organizationToCheck.Members && Array.isArray(organizationToCheck.Members) && organizationToCheck.Members.length > 0){
          var check = organizationToCheck.Members.find(x => {return x.id == user.id});
          console.log(check);
          if(check){
            return true;
          }else{ return false; }
        }else{ return false; }
      }else{ return false; }
    }else{ return false; }
  }

  async isUserMemberInProject(user){
    // Used to check if user is member in this.state.active_project
    if(user){
      var projectToCheck = this.state.active_project;
      if(projectToCheck){
        if(projectToCheck.Members && Array.isArray(projectToCheck.Members) && projectToCheck.Members.length > 0){
          var check = projectToCheck.Members.find(x => {return x.id == user.id});
          if(check){
            return true;
          }else{ return false; }
        }else{ return false; }
      }else{ return false; }
    }else{ return false; }
  }

  async getActiveProject(){
    // Return project which should be set to active project
    // This function is called on login or after data update

    var user = this.state.user;
    var active_organization = this.state.active_organization;

    if(user.type == "admin"){
      if(active_organization.Projects && Array.isArray(active_organization.Projects) && active_organization.Projects.length > 0){
        return active_organization.Projects[0];
      }else{
        return {name: "No Project"};
      }
    }else{
      if(user.type == "manager"){
        return user.ManagingOrganization ? (user.ManagingOrganization.Projects && Array.isArray(user.ManagingOrganization.Projects) && user.ManagingOrganization.Projects.length > 0 ? user.ManagingOrganization.Projects[0] : {name: "No Project"}) : {name: "No Project"};
      }else{
        if(active_organization.Projects && Array.isArray(active_organization.Projects) && active_organization.Projects.length > 0){
          return active_organization.Projects[0];
        }else{
          return {name: "No Project"};
        }
      }
    }
  }

  async getManageableData(){
    // Returns users, organizations and projects the logged in user can manager according to their role/type

    var user = this.state.user;
    var active_organization = this.state.active_organization;

    var manageableUsers = [];
    var manageableProjects = [];
    var manageableOrganizations = [];

    if(user.type == "admin"){
      manageableUsers = this.state.allUsers;
      manageableOrganizations = this.state.allOrganizations;
      manageableProjects = active_organization.Projects;
    }else{
      if(user.type == "manager"){
        manageableUsers = active_organization.Members;
        manageableOrganizations = [];
        manageableProjects = active_organization.Projects;
      }else{
        // Not manager and Not admin can not manager any users, organizations or projects
      }
    }

    return { manageableUsers, manageableProjects, manageableOrganizations };
  }

  async readyUser(){
    // This function sets/resets active organization, active project and manageable data

    var active_organization = await this.getActiveOrganization();
    var IsMemInOrg = await this.isUserMemberInOrganization(active_organization.id, this.state.user);
    console.log(IsMemInOrg, active_organization, this.state.user, 'organization');

    this.setState({
      ...this.state,
      active_organization: active_organization,
      booleans: {
        ...this.state.booleans,
        IsMemInOrg: IsMemInOrg,
        userReady: false,
      }
    });

    var active_project = await this.getActiveProject();

    this.setState({
      ...this.state,
      active_project: active_project,
      booleans: {
        ...this.state.booleans,
        userReady: false,
      }
    });

    var isMemInProject = await this.isUserMemberInProject(this.state.user);
    var { manageableUsers, manageableProjects, manageableOrganizations } = await this.getManageableData();

    await this.setState({
      ...this.state,
      manageableUsers: manageableUsers,
      manageableProjects: manageableProjects,
      manageableOrganizations: manageableOrganizations,
      booleans: {
        ...this.state.booleans,
        isMemInProject: isMemInProject,
        userReady: true,
      }
    });
  }

  async fetchUser(){
    // Used to get logged in user data from the database/backend using api
    var { success, error, data } = await this.state.api.user();
    if(success){
      if(data){
        this.setState({
          ...this.state,
          user: data.user ? data.user : data,
          allOrganizations: data.allOrganizations ? data.allOrganizations : [],
          allUsers: data.allUsers ? data.allUsers : [],
          booleans: {
            ...this.state.booleans,
            userReady: false,
            userFetched: true,
            isLoggedIn: true,
          }
        });
        
        await this.setupSocket();
        this.readyUser();
      }
    }
  }

  async onLogin(email, password){
    // Used to login user and receive the authorization token from the database/backend using api
    var { success, error, data } = await this.state.api.login({email, password});

    if(success){
      await localStorage.setItem("auth_token", data.token); // stora received token in browser's localstorage // google for more info about localstorage
      this.setState({
        ...this.state,
        booleans: {
          ...this.state.booleans,
          isLoggedIn: true,
        }
      });
      
      this.fetchUser();
    }else{
      console.log(data.message ? data.message : null);
      this.setState({
        ...this.state,
        booleans: {
          ...this.state.booleans,
          isLoggedIn: false
        }
      });
    }
  }

  async onLogout(){
    // called when logout button pressed

    await localStorage.removeItem("auth_token"); // Remove token from localstorage
    await this.state.socket.disconnect(); // Disconnect from socket
    this.setState({ // Reset every dynamic information
      ...this.state,
      allUsers: [],
      allOrganizations: [],
      active_organization: {name: "No Organization"},
      active_project: {name: "No Project"},
      booleans: {
        isLoggedIn: false,
        moveColumns: false,
        userFetched: false,
        userReady: false,
        isMemInProject: false,
        IsMemInOrg: false,
      },
    });
  }

  async toggleMoveColumns(){
    // Called when move columns button is clicked
    // To check if logged in user can move columns

    var IsMemInOrg = await this.isUserMemberInOrganization(this.state.active_organization.id, this.state.user);
    var isMemInProject = await this.isUserMemberInProject(this.state.user);

    if(IsMemInOrg && isMemInProject){
      // if user is member in project and organization only then user can move columns
      this.setState({
        ...this.state,
        booleans: {
          ...this.state.booleans,
          moveColumns: this.state.booleans.moveColumns ? false : true,
        }
      });
    }
  }

  updateKanbanColumnsFrontEnd(columns){
    // function to update kanban columns for frontend
    console.log(columns);
    this.setState({
      ...this.state,
      active_project:{
        ...this.state.active_project,
        Kanban:{
          ...this.state.active_project.Kanban,
          KanbanColumns: columns,
        }
      },
    });
  }

  async updateActiveOrganization(organization){
    // Change this.state.active_organization to provided organization

    var IsMemInOrg = await this.isUserMemberInOrganization(organization.id, this.state.user);

    // Set IsMemInOrg to state as well
    this.setState({
      ...this.state,
      active_organization: organization,
      booleans: {
        ...this.state.booleans,
        IsMemInOrg: IsMemInOrg,
      },
    });
  }

  async updateActiveProject(project){
    // Change this.state.active_project to provided project
    await this.setState({
      ...this.state,
      active_project: project,
    });

    setTimeout(async () => {
      var isMemInProject = await this.isUserMemberInProject(this.state.user);

      // Set isMemInProject to state as well

      this.setState({
        ...this.state,
        booleans: {
          ...this.state.booleans,
          isMemInProject: isMemInProject,
        },
      });
    }, 100);
  }

  render(){
    // Return Dashboard component wrapped inside MainContext.Provider
    // Read react docs for more info on contexts
    return( <MainContext.Provider value={this.state}>
        <Dashboard key={this.state} data={this.state}></Dashboard>
      </MainContext.Provider>
    )
  }
}

export default App;
