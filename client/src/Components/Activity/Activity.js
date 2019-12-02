import React, { Component } from 'react';
import ActivityComment from './ActivityComment';
import './ActivityComment.css';

export function MarkAsRead(ticket_ID, technician_ID) {
    fetch('/activity/mark_as_read/' + ticket_ID + '/' + technician_ID, {
        method: 'get',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
    })
        .then(response => response.text())
        .then(response => {
            if (response === "Update last_seen_comment_ID error") {
                console.log("Error marking ticket as read: " + response);
            } else {
                console.log(response);
            }
        });
}


class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedTickets: [],
            theTicket: null
        }

        this.getActivity = this.getActivity.bind(this);
        this.getActivity();
    }

    getActivity() {
        fetch('/activity/get_activity/' + localStorage.user, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
        })
            .then(response => response.json())
            .then(response => {
                if (response === "Max comment error") {
                    console.log("Max comment error");
                } else {
                    console.log("Updated tickets: " + response);
                    this.setState({ updatedTickets: response });
                }
            });
    }


    render() {
        return (
            <div>
                {
                    this.state.updatedTickets.length > 0
                        ?
                        this.state.updatedTickets.map((value, index) => {
                            return (
                                <div className="activity_background" key={`key - ${index}`}>
                                    <ActivityComment ticket_ID={value} changeSelectedTicket={this.props.changeSelectedTicket} />
                                </div>
                            )
                        })
                        :
                        <div className="activity_background">
                            No new activity! <span role="img" aria-label="party">🎉</span>
                        </div>
                }
            </div>
        )
    }
}

export default Activity;