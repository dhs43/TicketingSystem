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
import { Redirect } from 'react-router';

class TicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            loggedin: true,
            order:'desc',
            orderBy: 'time_submitted',
            selected: [],
            page:0,
        }

        this.loadAllTickets();

        this.headCells = [
            { id: 'ticket_ID', numeric: false, disablePadding: true, label: 'Ticket ID' },
            { id: 'subject', numeric: true, disablePadding: false, label: 'Subject' },
            { id: 'customer_ID', numeric: true, disablePadding: false, label: 'Customer ID' },
            { id: 'severity', numeric: true, disablePadding: false, label: 'Severity' },
            { id: 'time_submitted', numeric: true, disablePadding: false, label: 'Time Submitted' },
            { id: 'assigned_technician_ID', numeric: true, disablePadding: false, label: 'Assigned Technician ID' },
        ];

        this.desc = this.desc.bind(this);
        this.stableSort = this.stableSort.bind(this);
        this.getSorting = this.getSorting.bind(this);
        this.loadAllTickets = this.loadAllTickets.bind(this);
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
        // TODO: Eventually enable user to change rowsPerPage. Also enable user to navigate pages. As it stands
        //  user looses info after page cut off.
        const rowsPerPage = 5;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.allOfTheTickets.length - this.state.page * rowsPerPage);

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
                                    .slice(this.state.page * rowsPerPage, this.state.page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                    return (
                                        <TableRow
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
                        {/*TODO: Make Rows per Page selection functional as well as next and pevious page*/}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.state.allOfTheTickets.length}
                            rowsPerPage={rowsPerPage}
                            page={this.state.page}
                            backIconButtonProps={{
                                'aria-label': 'previous page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'next page',
                            }}
                            onChangePage={handleChangePage}
                            // onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <p> Hey I want comments / ticket info loaded here</p>
                </div>
            );
        }
    }
}
export default TicketPage;