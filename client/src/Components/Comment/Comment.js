import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TimeAgo from 'react-timeago'
import "./Comment.css";

class Comment extends Component {
    render() {
        return (
            <Paper>
                <div className="box">
                    <TimeAgo className="time-ago" date={this.props.creation_date} />
                    <h4>{this.props.author_ID}</h4>
                    <p>{this.props.text}</p>
                </div>
            </Paper>
        )
    }
}

export default Comment;
