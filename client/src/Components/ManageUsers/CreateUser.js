import React, {Component} from "react";
import {NotificationManager} from "react-notifications";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl"
import { FormControlLabel } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import "./CreateUser.css";
import 'react-notifications/lib/notifications.css';

class CreateUser extends Component {
    constructor(props) {
        super(props);

        // initialize state so that the state of the tech is not submitted and it's information is blank
        this.state = {
            first_name: '',
            last_name: '',
            is_admin: '',
            password: '',
            email: '',
            submitted: false
        };

        // taken from Login.js to handle user input and submission
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
    }

    // handles user input
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // submit user
    submitHandler(e) {
        e.preventDefault();


        if (this.state.first_name.trim() === "") {
            NotificationManager.error('Please Enter First Name', '');
            return;
        }

        if (this.state.last_name.trim() === "") {
            NotificationManager.error('Please Enter Last Name', '');
            return;
        }

        if (this.state.is_admin.trim() === "") {
            NotificationManager.error('Please Indicate if user will have admin privileges', '');
            return;
        }

        if (this.state.password.trim() === "") {
            NotificationManager.error('Please Enter Password', '');
            return;
        }

        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        if (this.state.email.trim() === "" || !emailRegex.test(this.state.email.trim())) {
            NotificationManager.error('Please Enter a Valid Email', '');
            return;
        }

        fetch('users/newUser', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: this.state.first_name.trim(),
                last_name: this.state.last_name.trim(),
                is_admin: this.state.is_admin === 'true' ? 1:0,
                password: this.state.password.trim(),
                active_user:true,
                email: this.state.email.trim(),

            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "New user created") {
                    NotificationManager.success('New User Created!', '');
                } else {
                    this.setState({ submitted: true });
                    NotificationManager.error('Error Creating User', '');
                }
            });

        setTimeout(() => {
            this.props.history.push('/');
        }, 4000);


    }

    closeHandler(){
        this.props.history.push('/');
    }

    render(){
        // Styles Radio buttons
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#5C8021' }, // Purple and green play nicely together.
                secondary: { main: '#25551b' }, // This is just green.A700 as hex.
            },
        });

        return(
            <div>
                <MuiThemeProvider theme={theme}>
                    <form className="createUser" onSubmit={e => this.submitHandler(e)}>
                        <IconButton
                            aria-label="close"
                            onClick={this.closeHandler}
                        >
                            <CloseIcon color="primary" fontSize="large" />
                        </IconButton>
                        <h1 className="createUserHeader"> Create User </h1>
                        <TextField
                            required
                            className="medium"
                            label="First Name"
                            name="first_name"
                            margin="normal"
                            variant="filled"
                            value={this.state.first_name}
                            onChange={e => this.changeHandler(e)}
                        />
                        <TextField
                            required
                            className="medium"
                            label="Last Name"
                            name="last_name"
                            margin="normal"
                            variant="filled"
                            value={this.state.last_name}
                            onChange={e => this.changeHandler(e)}
                        />
                        <TextField
                            required
                            className="medium"
                            label="Technician Email Address"
                            name="email"
                            margin="normal"
                            variant="filled"
                            value={this.state.email}
                            onChange={e => this.changeHandler(e)}
                        />
                        <FormControl component={'fieldset'}>
                        <FormLabel component="legend"> Access </FormLabel>
                            <RadioGroup
                                aria-label="admin"
                                name="is_admin"
                                value={this.state.is_admin}
                                onChange={e => this.changeHandler(e)}>
                                <FormControlLabel
                                    control={<Radio color="primary" />}
                                    label="Admin"
                                    value='true' />
                                <FormControlLabel
                                    control={<Radio color="primary" />}
                                    label="Technician"
                                    value='false' />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            required
                            className="medium"
                            label="Technician Password"
                            name="password"
                            margin="normal"
                            variant="filled"
                            value={this.state.password}
                            onChange={e => this.changeHandler(e)}
                        />
                        <button
                            className="createUserButton"
                            color="primary"
                            type="submit">
                            Submit Ticket
                        </button>
                    </form>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default CreateUser;