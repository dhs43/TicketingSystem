import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import './ActivityComment.css';

class ActivityComment extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <Paper className="activity_paper">
                <div class="activity_comment">
                    Ticket activity updates will go here.
                </div>
            </Paper>
        );
    }
}

export default ActivityComment;