// KanbanColumn Component

import React, {Component} from 'react';
import Capitalize from '../functions/Capitalize';
import KanbanColumnCard from '../components/kanbancolumncard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/fontawesome-free-solid';
import '../scss/kanban.scss';
import ThemeColors from '../scss/colors.js';

import MainContext from '../contexts/MainContext';

class KanbanColumn extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            id: `column@${Math.random()}`, // random id for column
            changeStyle: false,
            isKanbanColumnReady: false,
        };
    }

    async asyncSetup(){
        this.setState({
            ...this.state,
            dragColumns: this.context.booleans.moveColumns,
            isKanbanColumnReady: true,
        });
    }

    componentDidMount(){
        console.log(this.context);
        this.asyncSetup();
    }

    dragStart(e){
        //console.log(e);

        let data = {
            type: "column",
            column_one_element_id: this.state.id, 
            column_one_element_holder_id: this.props.holderId, 
            column_one_data: this.state.data,
        };

        // Set data to event, to pass it to drop event
        e.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    dragEnd(e){
        // Drag would not end if user can not move the columns
        if(this.context.booleans.moveColumns){
            //console.log(e);
            
            // Call onDrop callback provided by kanban to move columns
            this.props.onDrop(e);
        }else{
            e.preventDefault();
            return false;
        }
    }

    async onDelete(e){
        // Create delete request
        var { success, error, data } = await this.context.api.delete("project/column", { id: this.props.data.id, kanban_id: this.props.data.kanban_id, });
        console.log(success, error, data);

        return true;
    }

    render(){
        return this.state.isKanbanColumnReady ? (
            this.state.data.id == 0 ? <div onClick={() => this.props.onAddStart("Column", {columnData: this.state.data,}, {})} key={`kc-${this.state.data.id}`} style={{ marginLeft: "25px", }} className="kanban-column">
                <div className="kanban-column-cards">
                    <span style={{ position: "absolute", top: "50%", left: "50%", }}><FontAwesomeIcon color={"white"} icon={faPlus} /></span>
                </div>
            </div> : <div id={this.state.id} draggable={this.context.booleans.moveColumns} onDragStart={this.context.booleans.moveColumns ? this.dragStart.bind(this) : () => {}} onDragEnd={this.context.booleans.moveColumns ? this.dragEnd.bind(this) : () => {}} key={`kc-${this.state.data.id}`} className={this.state.changeStyle ? "highlight-kanban-column kanban-column" : "kanban-column"}>
                <div className="kanban-column-details">
                    <h3>{Capitalize(this.state.data.name)}</h3>
                    {this.context.user.type == "manager" ? <span onClick={this.onDelete.bind(this)} title="Delete Column (All cards in this column will also get deleted.)" className="delete-column-icon" style={{ position: "absolute", display: "block", right: "0px", top: "0px", margin: 0, padding: 0, cursor: "pointer"}}><FontAwesomeIcon color={`#${ThemeColors()[1].hex}`} icon={faTrash} /></span> : false}
                </div>
                <div className="kanban-column-cards">
                    {Array.isArray(this.state.data.KanbanColumnCards) ? [this.context.booleans.isMemInProject && this.context.booleans.IsMemInOrg ? {id: 0, } : {id: null,}, ...this.state.data.KanbanColumnCards].map((card) => {return card.id == null ? <span></span> : card.id !== 0 ? <KanbanColumnCard onAddStart={this.props.onAddStart} columnData={this.state.data} dragColumns={this.context.booleans.moveColumns} onCardDrop={this.props.dropForCard} key={`crd-${card.id}`} data={card}></KanbanColumnCard> : <KanbanColumnCard onAddStart={this.props.onAddStart} columnData={this.state.data} dragColumns={null} onCardDrop={null} key={`crd-${card.id}`} data={card}></KanbanColumnCard>}) : false}
                </div>
            </div>
        ) : (<div></div>)
    }
}

export default KanbanColumn;