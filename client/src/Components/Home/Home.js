import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import "./Home.css";


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.submitTicketHandler = this.submitTicketHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    submitTicketHandler() {
        this.props.history.push('/SubmitTicket');
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    submitHandler(e) {
        e.preventDefault();

        fetch('/users/loginUser', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === 'auth failure') {
                    alert("Error logging in");
                } else {
                    localStorage.setItem("token", response);
                    this.setState({ loggedin: true });
                    this.props.history.push('/Main');
                    // //TEST IF USER CAN ACCESS PRIVATE ROUTE
                    // console.log(localStorage.token);
                    // fetch('/users/test', { headers: { "Authorization": "Bearer " + localStorage.token } })
                    //     .then(response => response.text())
                    //     .then(response => {
                    //         console.log(response);
                    //         alert("You have logged in sucessfully.")
                    //     });
                }
            });
    }

    render() {
        return (

            <div className="backdrop">
                <div className="appbar">
                    <h1 className="title">
                        Resnet Helpdesk
                </h1>
                </div>
                <div className="outline">
                    <div className="outline2">
                        <form className="paper" onSubmit={e => this.submitHandler(e)}>
                            <h5>
                                Have an Issue?
                            </h5>
                            <Button className="button" color="primary" variant="contained" onClick={this.submitTicketHandler}>
                                SUBMIT TICKET
                            </Button>
                            <h5>
                                Technician Sign In
                            </h5>
                            <TextField
                                label="Email"
                                name="email"
                                variant="filled"
                                value={this.state.email}
                                onChange={e => this.changeHandler(e)}
                            />
                            <TextField
                                label="Password"
                                name="password"
                                margin="normal"
                                variant="filled"
                                type="password"
                                value={this.state.password}
                                onChange={e => this.changeHandler(e)}
                            />
                            <Button
                                className="button"
                                color="primary"
                                variant="contained"
                                type="submit">
                                Login
                            </Button>
                            <p>Don't have an account? Too bad!</p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
