import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Paper from '@material-ui/core/Paper';
import InventoryTable from "./InventoryTable";
import "./InventoryPage.css";
import { MarkAsRead } from '../Activity/Activity';

class InventoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            allOfTheComments: [],
            loggedin: true,
            orderBy: 'time_submitted',
            selected: [],
            theTicket: null,
            internal: 'false',
            filter: 'all',
        };


        this.loadTickets();
        this.loadTickets = this.loadTickets.bind(this);
        this.loadTicket = this.loadTicket.bind(this);
        this.submitTicketHandler = this.submitTicketHandler.bind(this);
        this.deleteTicketHandler = this.deleteTicketHandler.bind(this);
        this.RenderTicketDetails = this.RenderTicketDetails.bind(this);
    }

    //load inventory
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

    //inventory object data
    loadTicket(num) {
        fetch('/tickets/' + num, {
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
            .then(data => this.setState({ theTicket: data }))
            .catch(err => console.log(err));

        // this.loadAllComments(num);
        // MarkAsRead(num, this.state.loggedinTech.technician_ID);
    }

    //add inventory item
    submitTicketHandler() {
        this.props.history.push('/SubmitTicket');
    }

    //delete inventory item
    deleteTicketHandler() {
        if (window.confirm("Are you sure you'd like to delete this ticket?")) {
            var this_ticket_id = this.state.theTicket.ticket_ID;
            fetch('/tickets/delete/' + this_ticket_id, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
            })
                .then(response => response.text())
                .then(response => {
                    if (response === "Ticket deleted successfully") {
                        this.setState({ theTicket: null });
                        alert("Deleted ticket #" + this_ticket_id);
                    } else {
                        alert("Error deleting ticket");
                    }
                });
        }
    }

    //inventory details
    RenderTicketDetails() {
        if (this.state.theTicket === null) {
            return <div></div>;
        } else {
            var location = undefined;
            if (this.state.theTicket.location === "canyon") {
                location = "Canyon";
            } else if (this.state.theTicket.location === "hill") {
                location = "Hill";
            } else if (this.state.theTicket.location === "cypress") {
                location = "Cypress";
            } else if (this.state.theTicket.location === "creekview") {
                location = "Creekview";
            } else if (this.state.theTicket.location === "campus_apartments") {
                location = "Campus Apartments";
            } else if (this.state.theTicket.location === "college_creek") {
                location = "College Creek";
            }

            return (
                <div className="ticketDetails">
                    {this.state.theTicket.customer_name + "\n"}
                    {this.state.theTicket.phone_number === null || this.state.theTicket.phone_number === "" ? null : "(" + this.state.theTicket.phone_number.slice(0, 3) + ")" + this.state.theTicket.phone_number.slice(4) + "\n"}
                    {this.state.theTicket.location === "" ? null : location + '\n'}
                    {this.state.theTicket.customer_ID + "\n"}
                </div>
            );
        }
    }

    render() {
        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div className="ticketPage">
                    <Paper>
                        <InventoryTable
                            allOfTheTickets={this.state.allOfTheTickets}
                            loadTicket={this.loadTicket}
                            submitTicketHandler={this.submitTicketHandler}
                        />
                    </Paper> 
                    <div className="marginTop">
                        {this.state.theTicket === null ? null :
                            <div className="details">
                                {this.state.theTicket === null ? null : <h3 className="ticketSubject">{this.state.theTicket.subject}</h3>}
                                {this.state.theTicket === null ? null : <p className="ticketDescription">{this.state.theTicket.description}</p>}
                                <this.RenderTicketDetails />
                            </div>
                        }
                    </div>
                </div>
            );
        }
    }
}
export default InventoryPage;
