import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';


class TicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: {
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
            },
        }

        const rows = this.state.allOfTheTickets;

        function desc(a, b, orderBy) {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        }

        function stableSort(array, cmp) {
            const stabilizedThis = array.map((el, index) => [el, index]);
            stabilizedThis.sort((a, b) => {
                const order = cmp(a[0], b[0]);
                if (order !== 0) return order;
                return a[1] - b[1];
            });
            return stabilizedThis.map(el => el[0]);
        }

        function getSorting(order, orderBy) {
            return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
        }

        const headCells = [
            {id: 'ticket_ID', numeric: false, disablePadding: true, label: 'ticket_ID'},
            {id: 'subject', numeric: true, disablePadding: false, label: 'subject'},
            {id: 'customer_ID', numeric: true, disablePadding: false, label: 'customer_ID'},
            {id: 'severity', numeric: true, disablePadding: false, label: 'severity'},
            {id: 'time_submitted', numeric: true, disablePadding: false, label: 'time_submitted'},
            {id: 'assigned_technician_ID', numeric: true, disablePadding: false, label: 'assigned_technician_ID'},
        ];

        function EnhancedTableHead(props) {
            const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
            const createSortHandler = property => event => {
                onRequestSort(event, property);
            };
        }


    }

}

export default TicketPage;