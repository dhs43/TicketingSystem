import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import "./Main.css";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = { screen: "Tickets" };

        // Redirect if not logged in
        if (localStorage.token === undefined) {
            this.props.history.push('/');
        }

        this.handleTicketClick = this.handleTicketClick.bind(this);
        this.handleInventoryClick = this.handleInventoryClick.bind(this);
        this.handleDataVClick = this.handleDataVClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
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
        return (
            <div className="backdrop">
                <div className="appbar">
                    <h1 className="title">
                        Resnet Helpdesk
                    </h1>
                    <Button onClick={this.handleLogout}>LOGOUT</Button>
                </div>
                <div className="outline">
                    <div className="outline2">
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
                        <div>
                            {(this.state.screen === "Tickets") ? <p>Tickets</p> : null}
                            {(this.state.screen === "Inventory") ? <p>Inventory</p> : null}
                            {(this.state.screen === "DataV") ? <p>Data Visualization</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;
