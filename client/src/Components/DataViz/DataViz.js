import React, { Component } from 'react';
import {FormControl, Select, MenuItem} from '@material-ui/core';
import {Grid, Paper} from '@material-ui/core';

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
        let tickets = [];
        if (period === 'all'){
            tickets =  this.state.allOfTheTickets;
        }else {
            let today = new Date();
            this.state.allOfTheTickets.forEach(d => {
                let date = new Date(d.time_submitted * 1000);
                if (today.getDate() - date.getDate() <= period) {
                    tickets.push(d);
                }
            });
            this.setState({
                relevant_tickets: tickets,
            });
        }
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
                <h1> Ticket Data </h1>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper>
                            <FormControl>
                                <label for={"sort data"}> Use Tickets from </label>
                                <Select
                                    name={"sort data"}
                                    onChange={handleChange()}
                                    defaultValue={7}
                                >
                                    <MenuItem value={7} > Last Week </MenuItem>
                                    <MenuItem value={30} > Last 30 Days</MenuItem>
                                    <MenuItem  value={90} > Last 90 Days </MenuItem>
                                    <MenuItem value={180} > Last 180 Days </MenuItem>
                                    <MenuItem value={365} > Last Year </MenuItem>
                                    <MenuItem value={'all'} > All Time </MenuItem>
                                </Select>
                            </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p> Current State of Tickets: Open, Closed, Waiting </p>
                            <PieGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p> Tickets submitted </p>
                            <AreaGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p> Tickets by Location </p>
                            <LocationGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p> Tickets by Severity: High, Medium, Low </p>
                            <SeverityGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                    {/*<Grid item xs={6} sm={3}>*/}
                    {/*    <Paper className={classes.paper}>xs=6 sm=3</Paper>*/}
                    {/*</Grid>*/}
                </Grid>
            </div>
        );
    }
}

export default DataViz;
