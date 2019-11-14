import React, { Component, forwardRef  } from 'react';
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
        this.headCells = [
            {id: 'ticket_ID', field: 'ticket_ID', title: 'ID', cellStyle:{ minWidth: 5, width: '1%'}},
            {id: 'subject', field: 'subject', title: 'Subject', cellStyle:{ minWidth: 300, width: '55%'}},
            {id: 'customer_ID', field: 'customer_ID', title: 'Customer', cellStyle:{ minWidth: 60, width: '12%'}},
            {id: 'severity', field: 'severity', title: 'Urgency', cellStyle:{ minWidth: 50, width: '10%'}},
            {id: 'time_submitted', field: 'time_submitted', title: 'Date', cellStyle:{ minWidth: 50, width: '10%'}},
            {id: 'assigned_technician_ID', field: 'assigned_technician_ID', title: 'Assignee', cellStyle:{ minWidth: 60, width: '12%'}},
        ];

        this.tableIcons = {
            Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
            Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
            Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
            Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
            DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
            Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
            Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
            Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
            FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
            LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
            NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
            PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
            ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
            Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
            SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref}/>),
            ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
            ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
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

        return(
            <MuiThemeProvider theme={theme}>
                <MaterialTable
                    hover
                    title={
                        <Toolbar>
                            <div className="toolbar">
                            <FormControl>
                                <Select onChange={console.log("change")} defaultValue={'all'}>
                                    <MenuItem value='all'>All Tickets</MenuItem>
                                    <MenuItem value='my_tickets'>My Tickets</MenuItem>
                                    <MenuItem value='unassigned'>Unassigned</MenuItem>
                                </Select>
                            </FormControl>
                            </div>
                        </Toolbar>
                    }
                    className={"table"}
                    icons={this.tableIcons}
                    columns={this.headCells}
                    data={this.props.allOfTheTickets}
                    onRowClick={(event, rowData) => (this.props.loadTicket(rowData.ticket_ID))}
                    options={{padding:'dense', pageSize: 15, pageSizeOptions: [5, 15, 25, 50], rowStyle:{ overflowY: 'scroll'}}}
                    columns={[
                        {
                            title: 'ID',
                            field: 'ticket_ID',
                        },
                        {
                            title: 'Subject',
                            field: 'subject',
                            customSort: (a, b) => {
                                if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            }
                        },
                        {
                            title: 'Customer',
                            field: 'customer_ID',
                            customSort: (a, b) => {
                                if (a.customer_ID.toLowerCase() > b.customer_ID.toLowerCase()) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            }
                        },
                        {
                            title: 'Urgency',
                            field: 'severity',
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
                            title: 'Date',
                            field: 'time_submitted',
                        },
                        {
                            title: 'Assignee',
                            field: 'assigned_technician_ID',
                            customSort: (a, b) => {
                                if (b.assigned_technician_ID === null) {
                                    return 1
                                }else if (a.assigned_technician_ID === null) {
                                    return -1;
                                }
                                if (a.assigned_technician_ID.toLowerCase() > b.assigned_technician_ID.toLowerCase()) {
                                    return 1;
                                } else {
                                    return -1;
                                }
                            }
                        },
                    ]}
                />
            </MuiThemeProvider>
        );
    }
}

export default TicketTable;
