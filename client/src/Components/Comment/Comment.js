import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import "./Comment.css";


class Comment extends Component {
    render() {
        return (
            <Paper>
                <div className="box">
                    <h4>{this.props.author_ID}</h4>
                    <p>{this.props.text}</p>
                </div>
            </Paper>
        )
    }
}

export default Comment;
