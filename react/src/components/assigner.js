// Assigner Component

import React, {Component} from 'react';
import '../scss/assigner.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AssignerItem from '../components/assigneritem';

import MainContext from '../contexts/MainContext';

class Assigner extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            display: this.props.display,
        };
    }

    componentDidMount(){
        console.log(this.context);
    }

    toggle(){
        // Toggle
        this.setState({
            display: this.state.display ? false : true,
        });
    }

    onOptionClick(e, data){
        // Called when an assigner option is clicked. (Assign to what selected)

        // Call onAssignerChange callback provided by the manager
        this.props.onAssignerChange(e, data);
    }

    render(){
        return(
            this.state.display && ["User"].includes(this.props.assigningWhat) ? <div id="assigner">
                <h4>Assign {this.props.assigningWhat} To {this.props.assigningTo}</h4>
                <div id="assigner-items">{Array.isArray(this.props.options) && this.props.options.length > 0 ? this.props.options.map(x => <AssignerItem onClick={this.onOptionClick.bind(this)} assignee_data={this.props.assigningWhatObj} data={x}></AssignerItem>) : false}</div>
            </div> : <div></div>
        )
    }
}

export default Assigner;