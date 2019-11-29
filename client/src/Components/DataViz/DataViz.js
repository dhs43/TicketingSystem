import React, { Component } from 'react';
import {FormControl, Select, MenuItem} from '@material-ui/core';

import PieGraph from './PieGraph.js';
import AreaGraph from "./AreaGraph.js";
import LocationGraph from "./LocationGraph";
import SeverityGraph from "./SeverityGraph";

class DataViz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            loggedin: true,
            filter: 'all',
            relevant_tickets: [],
        };

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.loadTickets();
        this.loadTickets = this.loadTickets.bind(this);
        this.sortTickets = this.sortTickets.bind(this);
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
                    this.setState({ allOfTheTickets: data.reverse() });
                    this.sortTickets(7);
                })
                .catch(err => console.log(err))
        }
    }

    sortTickets(period){ // period in days. Default week is 7
        let today = new Date();
        let tickets =[];
        this.state.allOfTheTickets.forEach(d=>{
            let date =  new Date(d.time_submitted * 1000);
            if( today.getDate() - date.getDate() <= period ){
                tickets.push(d);
            }
        });
        this.setState({
            relevant_tickets: tickets,
        });
        return tickets;
    }


    render(){
        const handleChange  =() => event => {
            this.setState({
                relevant_tickets: this.sortTickets(event.target.value),
            });
        };

        return(
            <div>
                <FormControl>
                    <Select
                        onChange={handleChange()}
                        defaultValue={7}
                    >
                        <MenuItem value={7} > Last Week </MenuItem>
                        <MenuItem value={30} > Last 30 Days</MenuItem>
                        <MenuItem  value={90} > Last 90 Days </MenuItem>
                        <MenuItem value={180} > Last 180 Days </MenuItem>
                        <MenuItem value={365} > Last Year </MenuItem>
                        <MenuItem value={0} > All Time </MenuItem>
                    </Select>
                </FormControl>
                <p> Current State of Tickets: Open, Closed, Waiting </p>
                <PieGraph
                    width={this.width}
                    height={this.height}
                    data={this.state.relevant_tickets}
                />
                <p> Tickets submitted </p>
                <AreaGraph
                    width={this.width}
                    height={this.height}
                    data={this.state.relevant_tickets}
                />
                <p> Tickets by Location </p>
                <LocationGraph
                    width={this.width}
                    height={this.height}
                    data={this.state.relevant_tickets}
                />
                <SeverityGraph
                    width={this.width}
                    height={this.height}
                    data={this.state.relevant_tickets}
                />
            </div>
        );
    }
}

export default DataViz;
