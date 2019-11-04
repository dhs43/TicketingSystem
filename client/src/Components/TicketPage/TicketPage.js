import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Redirect } from 'react-router';
import TableSortLabel from "@material-ui/core/TableSortLabel";

class TicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            loggedin: true
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
        const orderBy = "id";
        const order = "asc";

     handleRequestSort = (event, property) => {
         const isDesc = orderBy === property && order === 'desc';
         setOrder(isDesc ? 'asc' : 'desc');
         setOrderBy(property);
       };
                                                                                     

        // TODO: Eventually enable user to change rowsPerPage. Also understand rowsPerPage. 
        const rowsPerPage = 1;
        const page = 0;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.allOfTheTickets.length - page * rowsPerPage);

        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div>
                    <Paper>
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
                                            sortDirection={orderBy === headCell.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={order}
                                                onClick={this.getSorting(order, headCell.id)}
                                            >
                                            {headCell.label}
                                             {orderBy === headCell.id ? (
                                                <span>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </span>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                 {this.stableSort(this.state.allOfTheTickets, this.getSorting(order, orderBy))
                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                      // const isItemSelected = isSelected(row.name);
                                      // const labelId = `enhanced-table-checkbox-${index}`;
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
                    </Paper>
                </div>
            );
        }
    }

}

export default TicketPage;