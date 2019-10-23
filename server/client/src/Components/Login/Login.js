import React, { Component } from 'react';

class Login extends Component {
    state = { test: "ok" };

    componentDidMount() {
        fetch('/users/test')
            .then(res => res.text())
            .then(test => this.setState({ test }));
    }


    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Hello there! This is our Login Page!
            <div>{this.state.test}</div>
            </div>
        );
    }
}

export default Login;
