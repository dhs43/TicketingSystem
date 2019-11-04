import React, { Component } from 'react';

// material ui-imports
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import { FormControlLabel } from "@material-ui/core";

//import CSS
import "./SubmitTicket.css";


// class of Ticket Form and Submission
class SubmitTicket extends Component {
    constructor(props) {
        super(props);

        // initialize state so that the state of the ticket is not submitted and it's information is blank
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            location: '',
            subject: '',
            description: '',
            severity: '',
            submitted: false
        };

        // taken from Home.js to handle user input and submission
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    //Making function to create the Radio buttons or something
    // makeRadio= ()=>{
    //     return <Radio
    //         color="primary"
    //     />
    // }

    // handles user input
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    phoneChangeHandler(e) {
        // Adds dashes, limits to numbers only (with the dashes) 
        var number = e.target.value.split('-').join('');
        number = number.slice(0, 10);

        const numRegex = /^[0-9\b]+$/;
        if (number !== '' && !numRegex.test(number)) { return; }

        if (number.length > 3 && number.length < 7) {
            this.setState({ phone: number.slice(0, 3) + '-' + number.slice(3) });
        } else if (number.length > 6) {
            this.setState({ phone: number.slice(0, 3) + '-' + number.slice(3, 6) + '-' + number.slice(6) })
        }
        else {
            this.setState({ phone: number });
        }
    }

    // submit ticket
    submitHandler(e) {
        e.preventDefault();

        console.log(this.state);

        fetch('/submitTicket/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                email: this.state.email,
                phone: this.state.phone,
                location: this.state.location,
                subject: this.state.subject,
                description: this.state.description,
                severity: this.state.severity
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Ticket created successfully") {
                    alert("Ticket Submitted!");
                } else {
                    this.setState({ submitted: true });
                    alert("Error submitting ticket");
                }
            });
    }



    render() {
        return (
            <div>
                <form className="submitTicket" onSubmit={e => this.submitHandler(e)}>
                    <h1> Submit Ticket </h1>
                    <TextField
                        required
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
                        required
                        className="medium"
                        label="Student Email Address"
                        name="email"
                        margin="normal"
                        variant="filled"
                        value={this.state.email}
                        onChange={e => this.changeHandler(e)}
                    />
                    <TextField
                        className="medium"
                        label="Phone Number"
                        name="phone"
                        margin="normal"
                        variant="filled"
                        value={this.state.phone}
                        onChange={e => this.phoneChangeHandler(e)}
                    />
                    <FormLabel component="legend"> Location </FormLabel>
                    <RadioGroup
                        aria-label="location"
                        name="location"
                        value={this.state.location}
                        onChange={e => this.changeHandler(e)}>
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="Canyon"
                            value="canyon" />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="The Hill"
                            value="hill" />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="Cypress"
                            value="cypress" />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="Creekview"
                            value="creekview" />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="Campus Apartments"
                            value="campus_apartments" />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="College Creek"
                            value="college_creek" />
                    </RadioGroup>

                    <TextField
                        required
                        label="Ticket Subject"
                        name="subject"
                        margin="normal"
                        variant="outlined"
                        value={this.state.subject}
                        onChange={e => this.changeHandler(e)}
                    />
                    <TextField
                        required
                        label="Description of Issue"
                        name="description"
                        multiline
                        margin="normal"
                        variant="outlined"
                        rows="3"
                        value={this.state.description}
                        onChange={e => this.changeHandler(e)}
                    />
                    <FormLabel componet="legend" > Urgency </FormLabel>
                    <RadioGroup
                        aria-label="severity"
                        name="severity"
                        value={this.state.severity}
                        onChange={e => this.changeHandler(e)}>
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="High"
                            value="high" />
                        <FormControlLabel
                            control={<Radio color="primary" />}
                            label="Medium"
                            value="medium" />
                        <FormControlLabel
                            control={<Radio color="primary" />}
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