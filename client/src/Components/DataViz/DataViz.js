import React, { Component } from 'react';
import {FormControl, Select, MenuItem, InputLabel, FormHelperText} from '@material-ui/core';
import {Grid, Paper} from '@material-ui/core';

import PieGraph from './PieGraph.js';
import AreaGraph from "./AreaGraph.js";
import LocationGraph from "./LocationGraph";
import SeverityGraph from "./SeverityGraph";

import format from 'format-duration';

import "./DataViz.css";

class DataViz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            loggedin: true,
            relevant_tickets: [],
            total_time: "",
            relevant_time: "",
        }
        ;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.loadAllTickets();
        this.loadAllTickets = this.loadAllTickets.bind(this);

        this.sortTickets = this.sortTickets.bind(this);
        this.calculateTime = this.calculateTime.bind(this);

        // this.format = require('format-duration');

    }

    loadAllTickets() {
        if (this.state.loggedin === true){
            fetch('/tickets/all', {
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
                    console.log(this.state.allOfTheTickets);
                    console.log("TOTAL TIME " + this.calculateTime(this.state.allOfTheTickets));
                    this.setState({total_time: format(this.calculateTime(this.state.allOfTheTickets) * 1000)});
                })
                .catch(err => console.log(err))
        }else{
            alert("Error getting tickets");
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
        }
        this.setState({
            relevant_tickets: tickets,
        });
        this.setState({
            relevant_time: format(this.calculateTime(this.state.allOfTheTickets) * 1000)
        });
        return tickets;
    }

    calculateTime(tickets){
        let total = 0;
        tickets.forEach((d)=>{
               if (d.time_closed !== null ){
                   let time_spent = d.time_closed - d.time_submitted;
                   total = total + time_spent;
               }
            }
        );
        console.log("Calculate TIme total: " + total);
        return total;
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
                    <FormControl className={"selectTimeframe"}>
                        <FormHelperText> Tickets from Time Period</FormHelperText>
                        <Select
                            name={"sort-data-select"}
                            onChange={handleChange()}
                            defaultValue={7}
                            inputProps={{ 'aria-label': 'sort-data-select' }}
                        >
                            <MenuItem value={7} > Last Week </MenuItem>
                            <MenuItem value={30} > Last 30 Days</MenuItem>
                            <MenuItem  value={90} > Last 90 Days </MenuItem>
                            <MenuItem value={180} > Last 180 Days </MenuItem>
                            <MenuItem value={365} > Last Year </MenuItem>
                            <MenuItem value={'all'} > All Time </MenuItem>
                        </Select>
                    </FormControl>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Paper>
                            <h2 className={"dataHeader"}> Tickets Submitted </h2>
                            <p className={"dataNumber"}> {this.state.allOfTheTickets.length}</p>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper>
                            <h2 className={"dataHeader"}> Tickets Submitted for Time Period</h2>
                            <p className={"dataNumber"}> {this.state.relevant_tickets.length}</p>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper>
                            <h2 className={"dataHeader"}> Time Spent Resolving Issues (DD:HH:MM:SS)</h2>
                            <p className={"dataNumber"} >
                                {this.state.total_time}
                            </p>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper>
                            <h2 className={"dataHeader"}> Time Spent Resolving Issues for Time Period (DD:HH:MM:SS)</h2>
                            <p className={"dataNumber"}>
                                {this.state.relevant_time}
                            </p>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p className={"graphTitle"}> Current State of Tickets: Open, Closed, Waiting </p>
                            <PieGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p className={"graphTitle"}> Tickets by Severity: High, Medium, Low </p>
                            <SeverityGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p className={"graphTitle"}> Tickets by Location </p>
                            <LocationGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <p className={"graphTitle"}> Tickets submitted </p>
                            <AreaGraph
                                width={this.width}
                                height={this.height}
                                data={this.state.relevant_tickets}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default DataViz;
