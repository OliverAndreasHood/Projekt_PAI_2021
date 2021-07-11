// Adder Component

import React, {Component} from 'react';
import '../scss/adder.scss';

import MainContext from '../contexts/MainContext';

class Adder extends Component{
    static contextType = MainContext;
    constructor(props){
        super(props);
        this.state = {
            display: this.props.display,
            values: { // valuess of inputs
                column: {
                    name: "",
                },
                organization: {
                    name: "",
                },
                project: {
                    name: "",
                },
                card: {
                    title: "",
                    description: "",
                    start_date: null,
                    end_date: null,
                    importance: 1,
                },
                user: {
                    first_name: "",
                    last_name: "",
                    email: "",
                    password: "",
                    type: "student",
                    radios: {
                        student: true,
                        junior: false,
                        mid: false,
                        senior: false,
                    },
                },
            },
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

    onAdd(e){
        // Called on add button click
        var valuesToPass = {};
        var what = this.props.addingWhat.toLowerCase();

        if(what == "card"){ valuesToPass = this.state.values.card; }
        if(what == "column"){ valuesToPass = this.state.values.column; }
        if(what == "organization"){ valuesToPass = this.state.values.organization; }
        if(what == "project"){ valuesToPass = this.state.values.project; }
        if(what == "user"){ valuesToPass = this.state.values.user; }

        // Call onAdd callback provied by dashboard
        this.props.onAdd(e, valuesToPass, what);
    }

    onCancel(e){
        // Called on cancel button click
        // Call onCancel callback provied by dashboard
        //console.log(e);
        this.props.onCancel(e); 
    }

    vChng(e, what){
        // Update value when changed in state

        var w = what;
        var value = e.target.value;

        if(w == "cmn"){ this.setState({ ...this.state, values: {...this.state.values, column: {name: value,}, }, }); }
        if(w == "orgn"){ this.setState({ ...this.state, values: {...this.state.values, organization: {name: value,}, }, }); }
        if(w == "prjtn"){ this.setState({ ...this.state, values: {...this.state.values, project: {name: value,}, }, }); }
        if(w == "cdtitle"){ this.setState({ ...this.state, values: {...this.state.values, card: {...this.state.values.card, title: value,}, }, }); }
        if(w == "cddesc"){ this.setState({ ...this.state, values: {...this.state.values, card: {...this.state.values.card, description: value,}, }, }); }
        if(w == "cdstrt"){ this.setState({ ...this.state, values: {...this.state.values, card: {...this.state.values.card, start_date: value,}, }, }); }
        if(w == "cdend"){ this.setState({ ...this.state, values: {...this.state.values, card: {...this.state.values.card, end_date: value,}, }, }); }
        if(w == "cdimprtnc"){ this.setState({ ...this.state, values: {...this.state.values, card: {...this.state.values.card, importance: value,}, }, }); }
        if(w == "ufn"){ this.setState({ ...this.state, values: {...this.state.values, user: {...this.state.values.user, first_name: value,}, }, }); }
        if(w == "uln"){ this.setState({ ...this.state, values: {...this.state.values, user: {...this.state.values.user, last_name: value,}, }, }); }
        if(w == "ueml"){ this.setState({ ...this.state, values: {...this.state.values, user: {...this.state.values.user, email: value,}, }, }); }
        if(w == "upswrd"){ this.setState({ ...this.state, values: {...this.state.values, user: {...this.state.values.user, password: value,}, }, }); }
        if(w == "utype"){ 
            this.setState({ 
                ...this.state, 
                values: {
                    ...this.state.values, 
                    user: {
                        ...this.state.values.user, 
                        type: value,
                        radios: {
                            student: value.toString().trim().toLowerCase() == "student" ? true : false,
                            junior: value.toString().trim().toLowerCase() == "junior" ? true : false,
                            mid: value.toString().trim().toLowerCase() == "mid" ? true : false,
                            senior: value.toString().trim().toLowerCase() == "senior" ? true : false,
                        },
                    }, 
                }, 
            }); 
        }
    }

    getElements(){
        // Return elements to be rendered according to what is being added
        var userTypeRadioButtons = [<div className="radio-div"><input checked={this.state.values.user.radios.student} onChange={(e) => this.vChng(e, "utype")} type="radio" id="student" name="usertype" value="student"/><label for="student">student</label></div>,<div className="radio-div"><input checked={this.state.values.user.radios.junior} onChange={(e) => this.vChng(e, "utype")} type="radio" id="junior" name="usertype" value="junior"/><label for="junior">junior</label></div>,<div className="radio-div"><input checked={this.state.values.user.radios.mid} onChange={(e) => this.vChng(e, "utype")} type="radio" id="mid" name="usertype" value="mid"/><label for="mid">mid</label></div>,<div className="radio-div"><input checked={this.state.values.user.radios.senior} onChange={(e) => this.vChng(e, "utype")} type="radio" id="senior" name="usertype" value="senior"/><label for="senior">senior</label></div>];
        return [
            this.props.addingWhat == "Column" ? [<input value={this.state.values.column.name} onChange={(e) => this.vChng(e, "cmn")} type="text" maxLength="25" placeholder="Name"/>, <button onClick={this.onAdd.bind(this)}>Add</button>, <button onClick={this.onCancel.bind(this)}>Cancel</button>] : 
            this.props.addingWhat == "Card" ? [<input value={this.state.values.card.title} onChange={(e) => this.vChng(e, "cdtitle")} type="text" maxLength="25" placeholder="Name"/>, <input value={this.state.values.card.description} onChange={(e) => this.vChng(e, "cddesc")} type="text" maxLength="25" placeholder="Description"/>, <input value={this.state.values.card.start_date} onChange={(e) => this.vChng(e, "cdstrt")} type="date" maxLength="25" placeholder="Start"/>, <input value={this.state.values.card.end_date} onChange={(e) => this.vChng(e, "cdend")} type="date" maxLength="25" placeholder="End"/>, <input value={this.state.values.card.importance} onChange={(e) => this.vChng(e, "cdimprtnc")} type="number" max={5} min={1} placeholder="Importance"/>, <button onClick={this.onAdd.bind(this)}>Add</button>, <button onClick={this.onCancel.bind(this)}>Cancel</button>] : 
            this.props.addingWhat == "User" ? [<input value={this.state.values.user.first_name} onChange={(e) => this.vChng(e, "ufn")} type="text" maxLength="15" placeholder="First Name"/>, <input value={this.state.values.user.last_name} onChange={(e) => this.vChng(e, "uln")} type="text" maxLength="15" placeholder="Last Name"/>, <input value={this.state.values.user.email} onChange={(e) => this.vChng(e, "ueml")} type="text" maxLength="25" placeholder="Email"/>, <input value={this.state.values.user.password} onChange={(e) => this.vChng(e, "upswrd")} type="password" maxLength="15" placeholder="Password"/>, ...userTypeRadioButtons, <button onClick={this.onAdd.bind(this)}>Add</button>, <button onClick={this.onCancel.bind(this)}>Cancel</button>] : 
            this.props.addingWhat == "Organization" ? [<input value={this.state.values.organization.name} onChange={(e) => this.vChng(e, "orgn")} type="text" maxLength="25" placeholder="Name"/>, <button onClick={this.onAdd.bind(this)}>Add</button>, <button onClick={this.onCancel.bind(this)}>Cancel</button>] : 
            this.props.addingWhat == "Project" ? [<input value={this.state.values.project.name} onChange={(e) => this.vChng(e, "prjtn")} type="text" maxLength="25" placeholder="Name"/>, <button onClick={this.onAdd.bind(this)}>Add</button>, <button onClick={this.onCancel.bind(this)}>Cancel</button>] : 
            [],
        ];
    }

    render(){
        return(
            this.state.display ? <div id="adder">
                <h4>Add {this.props.addingWhat}</h4>
                {this.getElements()}
            </div> : <div></div>
        )
    }
}

export default Adder;