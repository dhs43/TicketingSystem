import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import "./Home.css";
import blue from "../../res/colors.js"

class Home extends Component{
    render(){
        return(
            <div className="backdrop">
            <div className="appbar">
                <h1 className="title">
                spinehurts
                </h1>
            </div>
            <div className="outline">
                <div className="outline2">
                <div className="paper">
                    <h5>
                    Have an Issue?
                    </h5>
                    <Button className="button" color="primary" variant="contained">
                        SUBMIT TICKET
                    </Button>
                    <h5>
                    Technician Sign In
                    </h5>
                    <TextField
                    label="Username"
                    variant="filled"/>
                    <TextField
                    label="Password"
                    margin="normal"
                    variant="filled"/>
                    <Button className="button" color="primary" variant="contained">
                        Login
                    </Button>
                    <p>Don't have an account?</p>
                </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Home;
