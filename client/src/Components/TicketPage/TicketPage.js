import React, { Component, forwardRef  } from 'react';
import { Redirect } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Comment from "../Comment/Comment.js";

class TicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            allOfTheComments: [],
            loggedin: true,
            orderBy: 'time_submitted',
            selected: [],
            theTicket: null,
            newComment: '',
            internal: 'false',
            loggedinTech: {
                technician_ID: '',
                firstname: '',
                lastname: '',
                is_admin: false
            }
        }

        this.loadTechnician();
        this.loadAllTickets();

        this.headCells = [
            { id: 'ticket_ID', field:'ticket_ID', title: 'Ticket ID' },
            { id: 'subject', field:'subject', title: 'Subject' },
            { id: 'customer_ID', field:'customer_ID', title: 'Customer ID' },
            { id: 'severity', field:'severity',title: 'Severity' },
            { id: 'time_submitted', field:'time_submitted', title: 'Time Submitted' },
            { id: 'assigned_technician_ID',field:'assigned_technician_ID', title: 'Technician ID' },
        ];

        this.tableIcons = {
            Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
            Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
            Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
            Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
            SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
        };

        this.loadAllTickets = this.loadAllTickets.bind(this);
        this.loadAllComments = this.loadAllComments.bind(this);
        this.loadTicket = this.loadTicket.bind(this);
        this.handleSaveComment = this.handleSaveComment.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.CreateCommentUI = this.CreateCommentUI.bind(this);
        this.loadTechnician = this.loadTechnician.bind(this);
    }

    loadTechnician() {
        console.log("Getting tech");
        if (localStorage.user !== undefined) {
            fetch('/users/getUser/' + localStorage.user, {
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
                .then(data => this.setState({
                    loggedinTech: {
                        technician_ID: data.technician_ID,
                        firstname: data.first_name,
                        lastname: data.last_name,
                        is_admin: data.active_user
                    }
                }))
                .catch(err => console.log(err))
        }
    }

    loadAllTickets() {
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
            .then(data => this.setState({ allOfTheTickets: data }))
            .catch(err => console.log(err))
    }

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

        this.loadAllComments(num);
    }

    loadAllComments(num) {
        fetch('/comments/' + num, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    this.logout();
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => this.setState({ allOfTheComments: data }))
            .catch(err => console.log(err))
    }

    handleSaveComment() {
        console.log(this.state.loggedinTech);
        fetch('/comments/new/' + this.state.theTicket.ticket_ID, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token },
            body: JSON.stringify({
                firstname: this.state.firstname,
                author_id: this.state.loggedinTech.technician_ID,
                text: this.state.newComment,
                internal: this.state.internal
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Comment created successfully") {
                    alert("Comment saved!");
                } else {
                    alert("Error submitting ticket");
                }
            });

        this.setState({ newComment: '', internal: 'false' });
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    CreateCommentUI() {
        if (this.state.theTicket !== null && this.state.loggedinTech.technician_ID !== null) {
            return (
                <div>
                    <TextField
                        label="Write a comment..."
                        name="newComment"
                        multiline
                        margin="normal"
                        variant="outlined"
                        rows="3"
                        value={this.state.newComment}
                        onChange={e => this.changeHandler(e)}
                    />
                    <Button
                        className="button"
                        color="primary"
                        variant="outlined"
                        type="submit"
                        onClick={this.handleSaveComment}>
                        Comment
                        </Button>
                </div>
            )
        } else {
            return <div></div>
        }
    }

    render() {
        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div>
                    <Paper>
                        <Toolbar>
                            <Typography variant="h6" id="tableTitle">
                                All Tickets
                            </Typography>
                        </Toolbar>
                        <MaterialTable
                            title={"Ticket Table"}
                            className={"table"}
                            icons={this.tableIcons}
                            columns={this.headCells}
                            data={this.state.allOfTheTickets}
                            onRowClick={(event,rowData) => (this.loadTicket(rowData.ticket_ID))}
                            hover
                        />
                    </Paper>
                    <Paper>
                        {this.state.theTicket === null ? <h1>Select Ticket Information</h1> : <h1>{this.state.theTicket.subject}</h1>}
                        {this.state.theTicket === null ? null : <p>{this.state.theTicket.description}</p>}
                        <this.CreateCommentUI />
                        {/* {this.state.allOfTheComments[0] === undefined ? <h1>Select Ticket Information</h1> : <h1>{this.state.allOfTheComments[0].ticket_ID}</h1>} */}
                        {this.state.allOfTheComments.map((value, index) => {
                            return <Comment key={value.comment_ID} author_ID={value.author_ID} text={value.text} />
                        })
                        }
                    </Paper>
                </div>
            );
        }
    }
}
export default TicketPage;