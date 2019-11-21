import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import './Activity.css';

class Activity extends Component {
    // constructor(props) {
    //     super(props);
    // }
    
    render() {
        return (
            <Paper className="activity_paper">
                <div>
                    Ticket activity updates will go here.
                </div>
            </Paper>
        );
    }
}

export default Activity;