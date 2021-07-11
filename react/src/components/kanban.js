// Kanban Component

import React, {Component} from 'react';
import KanbanColumn from '../components/kanbancolumn';
import KanbanColumnHolder from '../components/kanbancolumnholder';
import '../scss/kanban.scss';

import MainContext from '../contexts/MainContext';

class Kanban extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            data: null,
            dragColumns: false,
            isKanbanReady: false,
        };
    }

    async asyncSetup(){     
        this.setState({
            ...this.state,
            data: this.context.active_project.Kanban,
            dragColumns: this.context.booleans.moveColumns,
            isKanbanReady: true,
        });
    } 

    componentDidMount(){
        console.log(this.context);
        this.asyncSetup();
    }

    async replaceIndexesOfColumns(data){
        // Replace indexes (positions) of two columns

        // Returns updatedColumns for frontend change and two indexes for backend change
        var columns = this.context.active_project.Kanban.KanbanColumns;
        var column_one = columns.find(x => x.id == data.column_one_data.id);
        var column_two = columns.find(x => x.id == data.column_two_data.id);

        var column_one_index = column_one.position;
        var column_two_index = column_two.position;

        column_one.position = column_two_index; // new
        column_two.position = column_one_index; // old

        return {updatedColumns: columns, newIndex: column_two_index, oldIndex: column_one_index };
    }

    async onColumnMove(data){
        // Called when column is moved (dropped) from one column holder to another
        //console.log(data);
        if(this.context.booleans.moveColumns){
            if(data.type == "column"){
                console.log(data);

                var {updatedColumns, newIndex, oldIndex} = await this.replaceIndexesOfColumns(data);

                console.log(updatedColumns);

                this.setState({
                    ...this.state,
                    data: {
                        ...this.state.data,
                        columns: updatedColumns,
                    },
                });

                // Create update request
                var { success, error, data } = await this.context.api.edit("project/column", { id: data.column_one_data.id, kanban_id: data.column_one_data.kanban_id, position_new: newIndex, position_old: oldIndex, });
                console.log(success, error, data);
                
                this.context.functions.updateKanbanColumnsFrontEnd(updatedColumns); // Show column update on frontend
            }
        }
    }

    async changeColumnOfCard(data){
        // Delete card from old column's cards array and push into new column's cards array

        // Returns updatedColumns for frontend change and two column ids for backend change
        var columns = this.state.data.KanbanColumns;
        var column_one = columns.find(x => x.id == data.column_one_data.id);
        var column_two = columns.find(x => x.id == data.column_two_data.id);

        column_one.KanbanColumnCards = column_one.KanbanColumnCards.filter(x => x.id !== data.data.id);

        column_two.KanbanColumnCards.push(data.data);

        return {updatedColumns: columns, newColumn: column_two, oldColumn: column_one };
    }

    async onCardMove(data){
        // Called when card is moved (dropped) from one column to another
        //console.log(data);
        if(data.type == "card"){
            console.log(data);

            var {updatedColumns, newColumn, oldColumn} = await this.changeColumnOfCard(data);

            console.log(updatedColumns);

            this.setState({
                ...this.state,
                data: {
                    ...this.state.data,
                    columns: updatedColumns,
                },
            });

            // Create update request
            var { success, error, data } = await this.context.api.edit("project/card", { id: data.data.id, kanban_id: oldColumn.kanban_id, new_kanban_column_id: newColumn.id, old_kanban_column_id: oldColumn.id, });
            console.log(success, error, data);

            this.context.functions.updateKanbanColumnsFrontEnd(updatedColumns); // Show card update on frontend
        }
    }

    render(){
        return(
            this.state.isKanbanReady && this.context.active_project && this.context.active_project.Kanban ? <div id="kanban">
                {[...this.context.active_project.Kanban.KanbanColumns.sort(function(a, b) {return a.position - b.position }), this.context.booleans.isMemInProject && this.context.booleans.IsMemInOrg ? {id: 0, name: "New", columns: {},} : {id: null,}].map((column) => {return column.id == null ? <span></span> : column.id !== 0  ? <KanbanColumnHolder onAddStart={this.props.onAddStart} dragColumns={this.context.booleans.moveColumns} onCardMove={this.onCardMove.bind(this)} onColumnMove={this.onColumnMove.bind(this)} key={`ch-${column.id}`} data={column}></KanbanColumnHolder> : <KanbanColumn onAddStart={this.props.onAddStart} key={`c-${column.id}`} data={column}></KanbanColumn>})}
            </div> : <div></div>
        )
    }
}

export default Kanban;