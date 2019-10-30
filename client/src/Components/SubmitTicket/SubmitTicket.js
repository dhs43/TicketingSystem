import React, { Component } from 'react';

// material ui-imports
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import {FormControlLabel} from "@material-ui/core";

//import CSS
import "./SubmitTicket.css";

// class of Ticket Form and Submission
class SubmitTicket extends Component{
    constructor(props) {
        super(props);

        // initialize state so that the state of the ticket is not submitted and it's information is blank
        this.state ={
            firstname:'',
            lastname:'',
            id:'',
            email:'',
            phone:'',
            location:'',
            topic:'',
            subject:'',
            description:'',
            severtylevel:''
        };

        // taken from Home.js to handle user input and submission
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    // handles user input
    changeHandler(e) {
        this.setState({
           [e.target.name]:e.target.value
        });
    }

    // submit ticket
    submitHandler(e) {
        e.preventDefault();

        //TODO: remove when done testing
        console.log(this.state);

        // TODO: ASK what this does and Modify for ticket submission
        // fetch('/users/loginUser', {
        //     method: 'post',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         ticket: this.state.ticket,
        //         submitted: this.state.submitted
        //     })
        // });

        // fetch('getToken', {
        //     email: this.state.email,
        //     password: this.state.password
        // }).then(res => localStorage.setItem('jwt-auth', res.data));
    }


    render(){
        return(
            <div>
                <form className="submitTicket" onSubmit={e => this.submitHandler(e)}>
                    <h1> Submit Ticket </h1>
                    <TextField
                        className="medium"
                        label="First Name"
                        name="firstname"
                        margin="normal"
                        variant="filled"
                        value={this.state.firstname}
                        onChange={e => this.changeHandler(e)}
                    />
                    <TextField
                        className="medium"
                        label="Last Name"
                        name="lastname"
                        margin="normal"
                        variant="filled"
                        value={this.state.lastname}
                        onChange={e => this.changeHandler(e)}
                    />
                    <TextField
                        className="medium"
                        label="Student ID"
                        name="id"
                        margin="normal"
                        variant="filled"
                        value={this.state.id}
                        onChange={e => this.changeHandler(e)}
                    />
                    <TextField
                        className="medium"
                        label="Email Address"
                        name="email"
                        margin="normal"
                        variant="filled"
                        value={this.state.email}
                        onChange={e => this.changeHandler(e)}
                    />
                    <FormLabel componet="legend"> Location </FormLabel>
                    <RadioGroup
                        aria-label="location"
                        name="location"
                        value={this.state.location}
                        onChange={e => this.changeHandler(e)}>
                        <FormControlLabel
                            control={<Radio />}
                            label="Canyon"
                            value="canyon" />
                        <FormControlLabel
                            control={<Radio />}
                            label="The Hill"
                            value="hill" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Cypress"
                            value="cypress" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Creekview"
                            value="creekview" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Campus Apartments"
                            value="campus_apartments" />
                        <FormControlLabel
                            control={<Radio />}
                            label="College Creek"
                            value="college_creek" />
                    </RadioGroup>
                    {/* Maybe change to checkboxes? */}
                    <FormLabel componet="legend" > Main Topic </FormLabel>
                    <RadioGroup
                        aria-label="topic"
                        name="topic"
                        value={this.state.topic}
                        onChange={e => this.changeHandler(e)}>
                        <FormControlLabel
                            control={<Radio />}
                            label="Wi-Fi"
                            value="wifi" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Computer Issue"
                            value="computer_issue" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Other Device"
                            value="other_device" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Canvas"
                            value="canvas" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Other"
                            value="other" />
                    </RadioGroup>

                    <TextField
                        label="Ticket Subject"
                        name="subject"
                        margin="normal"
                        variant="outlined"
                        value={this.state.subject}
                        onChange={e => this.changeHandler(e)}
                    />
                    <TextField
                        label="Description of Issue"
                        name="description"
                        multiline
                        margin="normal"
                        variant="outlined"
                        value={this.state.description}
                        onChange={e => this.changeHandler(e)}
                    />
                    <FormLabel componet="legend" > Severity </FormLabel>
                    <RadioGroup
                        aria-label="severity"
                        name="severity"
                        value={this.state.severity}
                        onChange={e => this.changeHandler(e)}>
                        <FormControlLabel
                            control={<Radio />}
                            label="High"
                            value="high" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Medium"
                            value="medium" />
                        <FormControlLabel
                            control={<Radio />}
                            label="Low"
                            value="low" />
                    </RadioGroup>
                    <Button
                        className="button"
                        color="primary"
                        variant="contained"
                        type="submit">
                        Submit Ticket
                    </Button>
                </form>
            </div>
        );
    }
}

export default SubmitTicket;