import React, {Component} from 'react';
import ActivityComment from './ActivityComment';
import './ActivityComment.css';

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