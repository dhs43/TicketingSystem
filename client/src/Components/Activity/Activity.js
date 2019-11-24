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
            if (response === "Sucessfully updated last_seen_comment_ID") {
                console.log('Success');
            } else {
                console.log(response);
                console.log("Error marking ticket as read");
            }
        });
}


class Activity extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <div className="activity_background">
                <ActivityComment />
            </div>
        );
    }
}

export default Activity;