// KanbanColumnHolder Component

import React, {Component} from 'react';
import Capitalize from '../functions/Capitalize';
import KanbanColumn from '../components/kanbancolumn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/fontawesome-free-solid';
import '../scss/kanban.scss';

import MainContext from '../contexts/MainContext';

class KanbanColumnHolder extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            changeStyle: false,
            elementToRender: <div></div>,
            holderId: `column-holder-id-${Math.random()}`, // random it for holder
        };
    }

    componentDidMount(){
        console.log(this.context);
        
        this.setState({
            ...this.state,
            elementToRender: <KanbanColumn onAddStart={this.props.onAddStart} dragColumns={this.context.booleans.moveColumns} dropForCard={this.dropForCard.bind(this)} holderId={this.state.holderId} onDrop={this.drop.bind(this)} key={`c-${this.state.data.id}`} data={this.state.data}></KanbanColumn>,
        });
    }

    dragOver(e){
        // Change style (opacity decreases) when something is dragged over it (column or card)

        e.dataTransfer.dropEffect = "move";
		e.preventDefault();

        this.setState({
            ...this.state,
            changeStyle: true,
        });
    }

    dragLeave(e){
        // Change style (opacity increases) when something was being dragged over it and now have left (column or card)

        e.dataTransfer.dropEffect = "move";
		e.preventDefault();

        this.setState({
            ...this.state,
            changeStyle: false,
        });
    }

    drop(e){
        // Called when something is dropped in it (column or card)
        if(this.context.booleans.moveColumns){
            // If is moving columns
            e.dataTransfer.dropEffect = "move";
            e.preventDefault();

            this.setState({
                ...this.state,
                changeStyle: false,
            });

            var eData = e.dataTransfer.getData("text/plain"); // Get data set by dragStart event of what is dropped
            var data = typeof eData === 'object' && eData !== null ? eData : typeof eData === 'string' && eData !== null ? JSON.parse(eData) : eData;

            if(this.context.booleans.moveColumns){
                if(data.type == "column"){
                    // If what is dropped is column, call onColumnMove callback provided by kanban
                    this.props.onColumnMove({...data, column_two_element_holder_id: this.state.holderId, column_two_data: this.state.data, });
                }
            }
        }else{
            // If is not moving columns then drop has to be of card
            this.dropForCard(e);
        }
    }

    dropForCard(e){
        //console.log(e);
        e.dataTransfer.dropEffect = "move";
		e.preventDefault();

        this.setState({
            ...this.state,
            changeStyle: false,
        });

        // Get data set by dragStart event of what is dropped
        var data = JSON.parse(e.dataTransfer.getData("text/plain"));
        console.log(data);

        if(data.type == "card"){
            //console.log("card");

            // If what is dropped is card, call onCardMove callback provided by kanban
            this.props.onCardMove({...data, column_two_data: this.state.data,});
        }
    }

    render(){
        return(
            <div id={this.state.holderId} className={this.state.changeStyle ? "kanban-column-holder highlight-kanban-column-holder" : "kanban-column-holder"} onDragOver={this.dragOver.bind(this)} onDragLeave={this.dragLeave.bind(this)} onDrop={this.drop.bind(this)}>
                {this.state.elementToRender}
            </div>
        )
    }
}

export default KanbanColumnHolder;