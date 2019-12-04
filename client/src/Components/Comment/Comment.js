import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TimeAgo from 'react-timeago'
import "./Comment.css";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";

class Comment extends Component {
    render() {

        let comment;
        console.log(this.props.internal);
        if(this.props.internal === 0)
        {
            comment = "external";
        }
        else
        {
            comment = "internal";
        }
        return (
                <Paper id={comment}>
                    <div className="commentBox">
                        <TimeAgo className="time-ago" date={this.props.creation_date} />
                        {comment === "internal" ? <h4>{this.props.author_ID + "   (Internal)"}</h4> : <h4>{this.props.author_ID}</h4>}
                        <p>{this.props.text}</p>
                    </div>
                </Paper>
        )}
}

export default Comment;
