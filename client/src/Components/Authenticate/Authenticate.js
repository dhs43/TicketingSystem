import React, { Component } from 'react';
import { getJwt } from './jwt.js';

class Authenticate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: undefined
        }
    }

    componentDidMount() {
        const jwt = getJwt();
        if (!jwt) {
            // If no JWT, redirect to login page
            this.props.history.push('/Login');
        }

        // fetch('/getUser', { headers: { Authorization: `Bearer ${jwt}` } })
        //     .then(res => this.setState({
        //         user: res.data
        //     })).catch(err => {
        //         localStorage.removeItem('jwt-auth');
        //         this.props.history.push('/Login');
        //     });
    }

    render() {
        if (this.state.user === undefined) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        }
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default Authenticate;