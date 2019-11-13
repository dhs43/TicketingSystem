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

class TicketTable extends Component {
    constructor(props) {
        super(props);
        this.headCells = [
            {id: 'ticket_ID', field: 'ticket_ID', title: 'ID', cellStyle:{ minWidth: 10, width: '5%'}},
            {id: 'subject', field: 'subject', title: 'Subject', cellStyle:{ minWidth: 300, width: '33%'}},
            {id: 'customer_ID', field: 'customer_ID', title: 'Customer', cellStyle:{ minWidth: 200, width: '16%'}},
            {id: 'severity', field: 'severity', title: 'Urgency', cellStyle:{ minWidth: 50, width: '10%'}},
            {id: 'time_submitted', field: 'time_submitted', title: 'Date', cellStyle:{ minWidth: 75, width: '16%'}},
            {id: 'assigned_technician_ID', field: 'assigned_technician_ID', title: 'User', cellStyle:{ minWidth: 200, width: '16%'}},
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
        return(
            <MaterialTable
                hover
                title={"Ticket Table"}
                className={"table"}
                icons={this.tableIcons}
                columns={this.headCells}
                data={this.props.allOfTheTickets}
                onRowClick={(event, rowData) => (this.props.loadTicket(rowData.ticket_ID))}
                options={{padding:'dense', pageSize: 15, pageSizeOptions: [15, 25, 50], rowStyle:{ overflowY: 'scroll'}}}
                // actions={[
                //     {
                //         tooltip:'Delete Tickets',
                //         icon:this.tableIcons.Delete,
                //         onClick:(event, data) => alert("You want to delete" + data.length + "rows")
                //     }
                // ]}
            />
        );
    }
}

export default TicketTable;
