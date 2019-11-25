import React, { Component } from 'react';
import callMe from './utils';

class DataViz extends Component {
    constructor(props) {
        super(props);

        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth;

        this.state = {
            allOfTheTickets: [],
            loggedin: true,
        };

        this.loadTickets();
        this.loadTickets = this.loadTickets.bind(this);
    }

    loadTickets() {
        if (this.state.filter === 'my_tickets') {
            this.loadMyTickets();
        } else if (this.state.filter === 'unassigned') {
            this.loadUnassignedTickets();
        } else if (this.state.filter === 'closed') {
            this.loadClosedTickets();
        } else {

            fetch('/tickets/open', {
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
                    data.forEach(item => {
                        var date = new Date(item.time_submitted * 1000);
                        item.time_submitted = (("0" + (date.getMonth() + 1)).slice(-2)) + '/' + (("0" + date.getDate()).slice(-2)) + '/' + date.getFullYear();
                    });
                    this.setState({ allOfTheTickets: data.reverse() })
                })
                .catch(err => console.log(err))
        }
    }

    render(){
        return(
            <div id={"heyAllyouPeople"}>
                <p> Data Visualization </p>
                <svg
                    transform={"translate(" + 0 + "," + 0 + ")"}
                    width={this.windowWidth - 500}
                    height={this.windowHeight - 200}
                    id={'dashboard'}
                >
                    {callMe('#dashboard', this.state.allOfTheTickets)}
                </svg>
            </div>
        );
    }
}

export default DataViz;
