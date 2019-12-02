import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import './ActivityComment.css';

class ActivityComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theTicket: null,
            last_comment: null
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

                // Fetch last comment ****************************
                fetch('comments/last_comment/' + num, {
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
                        this.setState({ last_comment: data });
                    })
                    .catch(err => console.log(err));
                // ***********************************************
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <Paper className="activity_paper" onClick={this.state.theTicket === null ? null : () => this.props.changeSelectedTicket(this.state.theTicket.ticket_ID)} >
                <div className="activity_comment">
                    {this.state.theTicket === null ? "Loading..." :
                        <div>
                            <div className="ticket_activity_bold">Ticket #{this.state.theTicket.ticket_ID}</div>
                            <div>{this.state.theTicket.subject}</div>
                            <div className="ticket_activity_bold">{this.state.last_comment === null ? null : this.state.last_comment.author_name}</div>
                            <div>
                                {this.state.last_comment === null ? null : this.state.last_comment.text.slice(0, 100)}
                                {this.state.last_comment !== null && this.state.last_comment.text.length > 100 ? "..." : null}
                            </div>
                        </div>
                    }
                </div>
            </Paper>
        );
    }
}

export default ActivityComment;