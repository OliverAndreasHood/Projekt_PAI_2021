// KanbanColumnCard Component

import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCircle, faTrash } from '@fortawesome/fontawesome-free-solid';
import Capitalize from '../functions/Capitalize';
import '../scss/kanban.scss';
import ThemeColors from '../scss/colors.js';
import moment from 'moment';

import MainContext from '../contexts/MainContext';

class KanbanColumnCard extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            canMoveThisCard: false,
            data: props.data,
            cardColor: props.data.color,
            cardColors: [ // Card colors, have to be same and in order exactly defined on backend in KanbanColumnCard model and in RequestValidator
                "black", "#084c61",
            ],
            colors: [ // Colors for importance 1 to 5
                {i: null, color: "black"},
                {i: 1, color: "#02b311"},
                {i: 2, color: "#cbff63"},
                {i: 3, color: "#ffea00"},
                {i: 4, color: "#ed8a00"},
                {i: 5, color: "#db2500"},
            ],
        };
    }

    componentDidMount(){
        console.log(this.context);

        this.setState({
            ...this.state,
            canMoveThisCard: (this.state.data.user_id == this.context.user.id && !this.context.booleans.moveColumns) ? true : false, // Can user move this card, true only if user created that card and user is not moving the columns
        })
    }

    dragStart(e){
        //console.log(e);
        let data = {
            type: "card",
            data: this.state.data,
            column_one_data: this.props.columnData,
        };

        // Set data to event to pass it to drop event
        e.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    dragEnd(e){
        //console.log(e);

        // Call onCardDrop callback provided by kanban column
        this.props.onCardDrop(e);
    }

    async changeColor(e){
        // Change card color to next color in cardColors array
        if(this.state.data.user_id == this.context.user.id){
            var newColorIndex = await this.state.cardColors.findIndex(x => x == this.state.cardColor);

            if(newColorIndex >= this.state.cardColors.length-1){
                newColorIndex = 0;
            }else{
                newColorIndex = newColorIndex + 1;
            }

            var newColor = await this.state.cardColors[newColorIndex];

            //console.log(newColorIndex, newColor);

            // Create update request
            var { success, error, data } = await this.context.api.edit("project/card/color", { id: this.props.data.id, color: newColor, });
            //console.log(success, error, data);

            this.setState({
                ...this.state,
                cardColor: newColor,
            })
        }
    }

    async onDelete(e){
        // Create delete request
        var { success, error, data } = await this.context.api.delete("project/card", { id: this.props.data.id, kanban_id: this.props.columnData.kanban_id, kanban_column_id: this.props.columnData.id, });
        console.log(success, error, data);

        return true;
    }

    render(){
        return(
            this.props.data.id == 0 ? <div onClick={() => this.props.onAddStart("Card", {columnData: this.props.columnData,}, {kanban_column_id: this.props.columnData.id,})} draggable={false} key={`kcc-${this.state.data.id}`} className="kanban-column-card">
                <span style={{marginLeft: '0px',}}><FontAwesomeIcon color={"white"} icon={faPlus} /></span>
            </div> : <div style={{backgroundColor: this.state.cardColor,}} onClick={(e) => this.changeColor(e)} draggable={this.state.canMoveThisCard} onDragStart={this.dragStart.bind(this)} onDragEnd={this.dragEnd.bind(this)} key={`kcc-${this.state.data.id}`} className="kanban-column-card">
                <div><h4>{Capitalize(this.state.data.title)}</h4></div>
                <div><p>{this.state.data.description}</p></div>
                <div><p>{moment(moment.utc(this.state.data.start_date)).local().format("DD-MM-YYYY")} - {moment(moment.utc(this.state.data.end_date)).local().format("DD-MM-YYYY")}</p></div>
                <span><FontAwesomeIcon color={this.state.colors.find(x => x.i == this.state.data.importance).color} icon={faCircle} /></span>
                {this.context.user.type == "manager" ? <span onClick={this.onDelete.bind(this)} title="Delete Card" className="delete-card-icon" style={{ position: "absolute", display: "block", right: "15px", top: "15px", margin: 0, padding: 0, cursor: "pointer"}}><FontAwesomeIcon color={`#${ThemeColors()[1].hex}`} icon={faTrash} /></span> : false}
            </div>
        )
    }
}

export default KanbanColumnCard;