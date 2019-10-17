import React, { Component } from 'react';

class Login extends Component{
    // state = {test: "ok"};

    // componentDidMount() {
    //     fetch('/api')
    //         .then(res => res.text())
    //         .then(test => this.setState({ test }));

    //     console.log(this.state.test);
    // }


    constructor(props){
        super(props);
	    console.log("temp"); // was getting an error about a "useless constructor" idk
    }

    render(){
        return(
        <div>
            Hello there! This is our Login Page!
        </div>
        );
    }
}

export default Login;
