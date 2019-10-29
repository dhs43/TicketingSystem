import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';


import SubmitTicket from "../SubmitTicket/SubmitTicket";
import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isOpen:false
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({isOpen: !this.state.isOpen})
    };

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
<<<<<<< Updated upstream:client/src/Components/Home/Home.js
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
=======

                    //TEST IF USER CAN ACCESS PRIVATE ROUTE
                    console.log(localStorage.token);
                    fetch('/users/test', { headers: { "Authorization": "Bearer " + localStorage.token } })
                        .then(response => response.text())
                        .then(response => {
                            alert("You have logged in successfully.")
                        });
>>>>>>> Stashed changes:server/client/src/Components/Home/Home.js
                }
            });
    }

    render() {
        return (

            <div className="backdrop">
                <div className="appbar">
                    <h1 className="title">
                        ResNet Help desk
                </h1>
                </div>
                <div className="outline">
                    <div className="outline2">
                        <form className="paper" onSubmit={e => this.submitHandler(e)}>
                            <h5>
                                Have an Issue?
                            </h5>
                            <Button
                                className="button"
                                color="primary"
                                variant="contained"
                                onClick={this.handleClick}>
                                SUBMIT TICKET
                            </Button>
                            <Modal
                                aria-labelledby="submit-ticket"
                                aria-describedby="form-to-submit-ticket"
                                open={this.state.isOpen}
                                onClose={this.handleClick}
                                scroll="body"
                            >
                                <SubmitTicket />
                            </Modal>
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
