import React, { Component, forwardRef } from 'react';
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
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';

class TicketTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTicket: null
        }

        this.headCells = [
            {
                id: 'ticket_ID',
                field: 'ticket_ID',
                title: 'ID',
                cellStyle: { minWidth: 5, width: '1%' }
            },
            {
                id: 'subject',
                field: 'subject',
                title: 'Subject',
                cellStyle: { minWidth: 300, width: '55%' },
                customSort: (a, b) => {
                    if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            },
            {
                id: 'customer_name',
                field: 'customer_name',
                title: 'Author',
                cellStyle: { minWidth: 60, width: '15%' },
                customSort: (a, b) => {
                    if (a.customer_name.toLowerCase() > b.customer_name.toLowerCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            },
            {
                id: 'severity',
                field: 'severity',
                title: 'Urgency',
                cellStyle: { minWidth: 50, width: '10%' },
                customSort: (a, b) => {
                    if (a.severity === 'low') {
                        return -1;
                    } else if (a.severity === 'high' && b.severity === 'medium') {
                        return 1;
                    } else if (a.severity === 'medium' && b.severity === 'high') {
                        return -1;
                    } else if (a.severity === b.severity) {
                        return 1;
                    }
                }
            },
            {
                id: 'time_submitted',
                field: 'time_submitted',
                title: 'Date',
                cellStyle: { minWidth: 50, width: '10%' },
            },
            {
                id: 'assigned_technician',
                field: 'assigned_technician',
                title: 'Assignee',
                cellStyle: { minWidth: 100, width: '12%' },
                customSort: (a, b) => {
                    if (a.assigned_technician === null) {
                        return -1;
                    } else if (b.assigned_technician === null) {
                        return 1;
                    } else if (a.assigned_technician.toLowerCase() > b.assigned_technician.toLowerCase()) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
            },
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

    }

    render() {
        // Styles
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#FFA500' }, // orange
                secondary: { main: '#25551b' } // dark green
            },
        });

        return (
            <MuiThemeProvider theme={theme}>
                <MaterialTable
                    hover
                    columns={this.headCells}
                    title={
                        <Toolbar>
                            <div className="toolbar">
                                <FormControl>
                                    <Select onChange={(event) => this.props.filterHandler(event.target.value)} defaultValue={'all'}>
                                        <MenuItem value='all'>Open</MenuItem>
                                        <MenuItem value='my_tickets'>My Tickets</MenuItem>
                                        <MenuItem value='unassigned'>Unassigned</MenuItem>
                                        <MenuItem value='closed'>Closed</MenuItem>
                                    </Select>
                                </FormControl>
                                <button className="createTicketButton" onClick={this.submitTicketHandler}>
                                    Create Ticket
                                </button>
                            </div>
                        </Toolbar>
                    }
                    className={"table"}
                    icons={this.tableIcons}
                    data={this.props.allOfTheTickets}
                    onRowClick={(event, rowData) => {
                        this.setState({selectedTicket: rowData.ticket_ID});
                        this.props.loadTicket(rowData.ticket_ID);
                    }}
                    options={{
                        padding: 'dense',
                        pageSize: 10,
                        pageSizeOptions: [5, 15, 25, 50],
                        sorting: true,
                        rowStyle: { overflowY: 'scroll' },
                    }}
                />
            </MuiThemeProvider>
        );
    }
}

export default TicketTable;
