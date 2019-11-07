import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Redirect } from 'react-router';
import Comment from "../Comment/Comment.js";


class TicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            allOfTheComments: [],
            loggedin: true,
            order:'desc',
            orderBy: 'time_submitted',
            selected: [],
            theTicket: null,
            page:0,
            rowsPerPage:5,
            newComment: '',
            internal: 'false'
        }

        this.loadAllTickets();

        this.headCells = [
            { id: 'ticket_ID', numeric: false, disablePadding: true, label: 'Ticket ID' },
            { id: 'subject', numeric: true, disablePadding: false, label: 'Subject' },
            { id: 'customer_ID', numeric: true, disablePadding: false, label: 'Customer ID' },
            { id: 'severity', numeric: true, disablePadding: false, label: 'Severity' },
            { id: 'time_submitted', numeric: true, disablePadding: false, label: 'Time Submitted' },
            { id: 'assigned_technician_ID', numeric: true, disablePadding: false, label: 'Technician ID' },
        ];

        this.desc = this.desc.bind(this);
        this.stableSort = this.stableSort.bind(this);
        this.getSorting = this.getSorting.bind(this);
        this.loadAllTickets = this.loadAllTickets.bind(this);
        this.loadAllComments = this.loadAllComments.bind(this);
        this.loadTicket = this.loadTicket.bind(this);
        this.handleSaveComment = this.handleSaveComment.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.CreateCommentUI = this.CreateCommentUI.bind(this);
    }

    loadAllTickets() {
        fetch('/tickets/all', {
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
                    this.logout();
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
        fetch('/comments/new/' + this.state.theTicket.ticket_ID, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer ' + localStorage.token},
            body: JSON.stringify({
                firstname: this.state.firstname,
                author_id: this.state.theTicket.customer_ID,
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
        
        this.setState({newComment: '', internal: 'false'});
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    CreateCommentUI() {
        if (this.state.theTicket !== null) {
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
        }else{
            return <div></div>
        }
    }

    desc(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    stableSort(array, cmp) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    getSorting(order, orderBy) {
        return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy);
    }

    render() {
        const emptyRows = this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.state.allOfTheTickets.length - this.state.page * this.state.rowsPerPage);

        let onRequestSort = (event,property) => {
            const isDesc = this.state.orderBy === property && this.state.order === 'asc';
            if (isDesc){
                this.setState({order:'desc' })
            } else {
                this.setState({order: 'asc'})
            }
            this.setState({orderBy: property});
        }

        const createSortHandler = property => event => {
            onRequestSort(event, property);
        };

        const handleChangePage = (event, newPage) => {
            this.setState({page:newPage});
        };

        const handleChangeRowsPerPage = event => {
            this.setState({rowsPerPage:parseInt(event.target.value, 10)});
            this.setState({page:0});
        };

        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div>
                    <Paper>
                        <Toolbar>
                            <Typography  variant="h6" id="tableTitle">
                                All Tickets
                            </Typography>
                        </Toolbar>
                        <Table
                            className={"table"}
                            aria-labelledby="tableTitle"
                            size="small"
                            aria-label="enhanced table"
                        >
                            <TableHead>
                                <TableRow>
                                    {this.headCells.map(headCell => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' : 'left'}
                                            padding={headCell.disablePadding ? 'none' : 'default'}
                                            sortDirection={this.state.orderBy === headCell.time_submitted ? this.state.order : false}
                                        >
                                            <TableSortLabel
                                                active={this.state.orderBy === headCell.time_submitted}
                                                direction={this.state.order}
                                                onClick={createSortHandler(headCell.id)}
                                            >
                                            {headCell.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                 {this.stableSort(this.state.allOfTheTickets, this.getSorting(this.state.order, this.state.orderBy))
                                    .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                    .map((row, index) => {
                                    return (
                                        <TableRow 
                                            //onClick={event => this.handleSelectTicket(row.ticket_ID)} 
                                            onClick={event => (this.loadTicket(row.ticket_ID))}
                                            key={row.ticket_ID}
                                            hover
                                        >
                                            <TableCell component="th" scope="row" padding="none">{row.ticket_ID}</TableCell>
                                            <TableCell align="right">{row.subject}</TableCell>
                                            <TableCell align="right">{row.customer_ID}</TableCell>
                                            <TableCell align="right">{row.severity}</TableCell>
                                            <TableCell align="right">{row.time_submitted}</TableCell>
                                            <TableCell align="right">{row.assigned_technician_ID}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (33) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.state.allOfTheTickets.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            backIconButtonProps={{
                                'aria-label': 'previous page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'next page',
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <Paper>
                        {this.state.theTicket === null ? <h1>Select Ticket Information</h1> : <h1>{this.state.theTicket.subject}</h1> }
                        {this.state.theTicket === null ? null : <p>{this.state.theTicket.description}</p> }
                        <this.CreateCommentUI />
                        {/* {this.state.allOfTheComments[0] === undefined ? <h1>Select Ticket Information</h1> : <h1>{this.state.allOfTheComments[0].ticket_ID}</h1>} */}
                        {this.state.allOfTheComments.map((value, index) => {
                            return <Comment author_ID={value.author_ID} text={value.text}/>
                        })
                        }
                    </Paper>
                </div>
            );
        }
    }
}
export default TicketPage;