// Module used for creating/altering database and making relationships between models

require('dotenv').config();
const { sequelize } = require('../sequelize');

// All models --------------------
const User = require('./models/User');
const Organization = require('./models/Organization');
const UserOrganizations = require('./models/UserOrganizations');
const Project = require('./models/Project');
const UserProjects = require('./models/UserProjects');
const Kanban = require('./models/Kanban');
const KanbanColumn = require('./models/KanbanColumn');
const KanbanColumnCard = require('./models/KanbanColumnCard');
// models end ---------------------

async function alterTables(force, alter){
    // force = true , deletes tables and creates them again.
    // alter = true , updates columns.
    // force or alter, only one can be true.

    if(force){
        sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
    }
    
    // Creating relationships between models
    Organization.belongsTo(User, { as: "Manager", foreignKey: 'manager_id', targetKey: "id", }); // organization has user as Manager
    User.hasOne(Organization, { as: "ManagingOrganization", foreignKey: 'manager_id', targetKey: "id", }); // user has organization as ManagingOrganization

    Organization.belongsToMany(User, { as: "Members", through: UserOrganizations, }); // organizations have users as Members
    User.belongsToMany(Organization, { as: "MemberOrganizations", through: UserOrganizations, }); // users have organizations as MemberOrganizations

    Organization.hasMany(Project, { foreignKey: "organization_id", }); // organizations have projects as Projects
    Project.belongsTo(Organization, { foreignKey: "organization_id", }); // projects have organization as Organization

    Project.belongsToMany(User, { as: "Members", through: UserProjects, }); // projects have users as Members
    User.belongsToMany(Project, { as: "MemberProjects", through: UserProjects, }); // users have projects as MemberProjects

    Project.belongsTo(Kanban, { as: "Kanban", foreignKey: 'kanban_id', targetKey: "id", }); // project has kanban as Kanban
    Kanban.hasOne(Project, { as: "Project", foreignKey: 'kanban_id', targetKey: "id", }); // kanban has project as Project

    Kanban.hasMany(KanbanColumn, { foreignKey: "kanban_id", }); // kanban have columns as KanbanColumns
    KanbanColumn.belongsTo(Kanban, { foreignKey: "kanban_id", }); // kanbancolumn have kanban as Kanban

    KanbanColumn.hasMany(KanbanColumnCard, { foreignKey: "column_id", }); // kanbancolumn have cards as KanbanColumnCards
    KanbanColumnCard.belongsTo(KanbanColumn, { foreignKey: "column_id", }); // kanbancolumncard have kanbancolumn as KanbanColumn

    KanbanColumnCard.belongsTo(User, { as: "Creator", foreignKey: 'user_id', targetKey: "id", }); // kanbancolumncard has user as Creator
    
    // Creating/altering tables
    await UserOrganizations.sync({ force: force , alter: alter, });
    await UserProjects.sync({ force: force , alter: alter, });

    await User.sync({ force: force , alter: alter, });
    await Organization.sync({ force: force , alter: alter, });
    await Project.sync({ force: force , alter: alter, });
    await Kanban.sync({ force: force , alter: alter, });
    await KanbanColumn.sync({ force: force , alter: alter, });
    await KanbanColumnCard.sync({ force: force , alter: alter, });

    if(force){
        sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    }
}

async function insertRandom(){

}

async function refreshRelationshipMemory(){
    // This function must be called on nodejs server start to sort of refresh relationship memory in the library used for db handling (sequelize.js)
    // Creating relationships between models
    
    Organization.belongsTo(User, { as: "Manager", foreignKey: 'manager_id', targetKey: "id", }); // organization has user as Manager
    User.hasOne(Organization, { as: "ManagingOrganization", foreignKey: 'manager_id', targetKey: "id", }); // user has organization as ManagingOrganization

    Organization.belongsToMany(User, { as: "Members", through: UserOrganizations, }); // organizations have users as Members
    User.belongsToMany(Organization, { as: "MemberOrganizations", through: UserOrganizations, }); // users have organizations as MemberOrganizations

    Organization.hasMany(Project, { foreignKey: "organization_id", }); // organizations have projects as Projects
    Project.belongsTo(Organization, { foreignKey: "organization_id", }); // projects have organization as Organization

    Project.belongsToMany(User, { as: "Members", through: UserProjects, }); // projects have users as Members
    User.belongsToMany(Project, { as: "MemberProjects", through: UserProjects, }); // users have projects as MemberProjects

    Project.belongsTo(Kanban, { as: "Kanban", foreignKey: 'kanban_id', targetKey: "id", }); // project has kanban as Kanban
    Kanban.hasOne(Project, { as: "Project", foreignKey: 'kanban_id', targetKey: "id", }); // kanban has project as Project

    Kanban.hasMany(KanbanColumn, { foreignKey: "kanban_id", }); // kanban have columns as KanbanColumns
    KanbanColumn.belongsTo(Kanban, { foreignKey: "kanban_id", }); // kanbancolumn have kanban as Kanban

    KanbanColumn.hasMany(KanbanColumnCard, { foreignKey: "column_id", }); // kanbancolumn have cards as KanbanColumnCards
    KanbanColumnCard.belongsTo(KanbanColumn, { foreignKey: "column_id", }); // kanbancolumncard have kanbancolumn as KanbanColumn

    KanbanColumnCard.belongsTo(User, { as: "Creator", foreignKey: 'user_id', targetKey: "id", }); // kanbancolumncard has user as Creator
}

async function test(){
    // function for testing
}

module.exports = {
    functions:{
        test,
        alterTables,
        insertRandom,
        refreshRelationshipMemory,
    },
}