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
            allOfTheInventory: [],
            loggedin: true,
            selected: [],
        };

        this.loadInventory();
        this.submitInventoryHandler = this.submitInventoryHandler.bind(this);
        this.deleteInventoryHandler = this.deleteInventoryHandler.bind(this);
    }

    //load inventory
    loadInventory() {
            fetch('/inventory/all_devices', {
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
                    this.setState({ allOfTheInventory: data.reverse() })
                })
                .catch(err => console.log(err))
    }

    //add inventory item
    submitInventoryHandler(newData) {
        fetch('/inventory/new_device', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token },
            body: JSON.stringify({
                title: newData.title.trim(),
                model: newData.model.trim(),
                serial_number: newData.serial_number.trim(),
                location: newData.location.trim(),
                status: newData.status.trim(),
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Device saved successfully") {
                    alert("Inventory Added!");
                } else {
                    console.log(response);
                    this.setState({ submitted: true });
                    alert("Error adding inventory object");
                }
            });
            //this.props.history.push('/');

    }

    //delete inventory item
    deleteInventoryHandler() {
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

    render() {
        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div className="ticketPage">
                    <Paper>
                        <InventoryTable
                            allOfTheInventory={this.state.allOfTheInventory}
                            submitInventoryHandler={this.submitInventoryHandler}
                            deleteInventoryHandler={this.deleteInventoryHandler}
                        />
                    </Paper>
                </div>
            );
        }
    }
}
export default InventoryPage;
