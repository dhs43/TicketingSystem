import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';


class Comment extends Component {
    constructor(props) {
        super(props);
    };

    render() {
       return (
       <Paper>
           <h2>{this.props.author_ID}</h2>
           <p>{this.props.text}</p>
       </Paper>
       )}
 }

export default Comment;
