import React, { Component } from 'react';
import { Redirect } from 'react-router';
import "./Main.css";
import TicketPage from "../TicketPage/TicketPage";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = { screen: "Tickets", loggedin: true, subject: 'Loading...' };

        // Redirect if not logged in
        if (localStorage.token === undefined) {
            this.props.history.push('/');
        }

        this.handleTicketClick = this.handleTicketClick.bind(this);
        this.handleInventoryClick = this.handleInventoryClick.bind(this);
        this.handleDataVClick = this.handleDataVClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        this.loadTicket();
    }

    loadTicket() {
        fetch('/tickets/all', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    this.setState({ loggedin: false });
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => this.setState({ subject: data[0].subject }))
            .catch(err => console.log(err))
    }

    handleTicketClick() {
        this.setState(state => ({
            screen: "Tickets"
        }));
    }

    handleInventoryClick() {
        this.setState(state => ({
            screen: "Inventory"
        }));
    }

    handleDataVClick() {
        this.setState(state => ({
            screen: "DataV"
        }));
    }

    handleLogout() {
        localStorage.removeItem('token');
        this.props.history.push('/');
    }

    render() {
        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div className="backdrop">
                    <div className="appbar">
                        <h1 className="title">
                            Resnet Helpdesk
                    </h1>
                        <div className="logout">
                            <button className="logout_button" onClick={this.handleLogout}>LOG OUT</button>
                        </div>
                    </div>
                    <div className="outline">
                        <div className="screen">
                            <div className={this.state.screen === "Tickets" ? "selectedTicket" : "selectionTicket"} onClick={this.handleTicketClick}>
                                Tickets
                            </div>
                            <div className={this.state.screen === "Inventory" ? "selectedInventory" : "selectionInventory"} onClick={this.handleInventoryClick}>
                                Inventory
                            </div>
                            <div className={this.state.screen === "DataV" ? "selectedDataV" : "selectionDataV"} onClick={this.handleDataVClick}>
                                Data Visualizer
                            </div>
                        </div>
                        <div className="outline2">
                            <div>
                                {(this.state.screen === "Tickets") ? <TicketPage /> : null}
                                {(this.state.screen === "Inventory") ? <p>Inventory</p> : null}
                                {(this.state.screen === "DataV") ? <p>Data Visualization</p> : null}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Main;