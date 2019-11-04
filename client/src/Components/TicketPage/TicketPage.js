import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class TicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [{
                ticket_ID: 112,
                subject: "Help, I've fallen and can't get up",
                customer_ID: 50,
                assigned_technician_ID: 0,
                description: "Every Senior Citizen Needs Life Alert",
                status: "o",
                time_spent: 300,
                time_submitted: 1200,
                time_closed: 1500,
                location: "canyon",
                severity: 3,
            }],

        }

        this.rows = this.state.allOfTheTickets;
        this.headCells = [
            {id: 'ticket_ID', numeric: false, disablePadding: true, label: 'ticket_ID'},
            {id: 'subject', numeric: true, disablePadding: false, label: 'subject'},
            {id: 'customer_ID', numeric: true, disablePadding: false, label: 'customer_ID'},
            {id: 'severity', numeric: true, disablePadding: false, label: 'severity'},
            {id: 'time_submitted', numeric: true, disablePadding: false, label: 'time_submitted'},
            {id: 'assigned_technician_ID', numeric: true, disablePadding: false, label: 'assigned_technician_ID'},
        ];

        this.desc = this.desc.bind(this);
        this.stableSort = this.stableSort.bind(this);
        this.getSorting = this.getSorting.bind(this);
        this.EnhancedTableHead = this.EnhancedTableHead.bind(this);

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

    EnhancedTableHead(props) {
        const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
        const createSortHandler = property => event => {
            onRequestSort(event, property);
        };
    }

    render() {

        const rowsPerPage = 10;
        const page = 0;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.rows.length - page * rowsPerPage);

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
                                        // sortDirection={orderBy === headCell.id ? order : false}
                                    >
                                        {headCell.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.rows.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                        >
                                            <TableCell component="th" scope="row" padding="none">
                                                {row.ticket_ID}
                                            </TableCell>
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

export default TicketPage;