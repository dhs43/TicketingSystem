import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import './ActivityComment.css';

class ActivityComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theTicket: null
        }

        this.loadTicket = this.loadTicket.bind(this);
        this.loadTicket(this.props.ticket_ID);
    }

    loadTicket(num) {
        fetch('/tickets/' + num, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    localStorage.removeItem('token');
                    this.setState({ loggedin: false });
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => {
                this.setState({ theTicket: data })
                console.log(data);
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <Paper className="activity_paper">
                <div class="activity_comment">
                    {this.state.theTicket === null ? "Loading..." : this.state.theTicket.subject}
                </div>
            </Paper>
        );
    }
}

export default ActivityComment;