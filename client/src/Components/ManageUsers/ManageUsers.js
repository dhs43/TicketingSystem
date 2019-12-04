import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonIcon from '@material-ui/icons/Person';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {NotificationManager, NotificationContainer} from "react-notifications";


class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state= {
            allTechnicians: null,
            techList:[],
            open:false,
        };

        this.loadAllTechnicians();
        this.handleUpdateUser = this.handleUpdateUser.bind(this);
        this.loadAllTechnicians = this.loadAllTechnicians.bind(this);
        this.generateList = this.generateList.bind(this);
        this.createUserHandler = this.createUserHandler.bind(this);
    }

    loadAllTechnicians() {
        fetch('/users/all_technicians', {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({ allTechnicians: response })
            }).then(()=> this.generateList() );
    }

    generateList(){
        let techList = this.state.allTechnicians.map(tech => {
            let full_name = tech.first_name + " " + tech.last_name;
            return(
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary= {full_name}
                        secondary={tech.active_user ? 'Is Active' : 'Not Active'}
                    />
                    {tech.active_user ?
                        <ListItemSecondaryAction>
                            <Tooltip title={"Disable User"}  aria-label={"disable-user"}>
                                <IconButton edge="end" aria-label="disable-user" onClick={(e) => this.handleUpdateUser(e,0, tech.technician_ID)}>
                                    <PersonAddDisabledIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction> :
                        <ListItemSecondaryAction>
                            <Tooltip title={"Activate User"}  aria-label={"activate-user"} onClick={(e) => this.handleUpdateUser(e,1, tech.technician_ID)}>
                                <IconButton edge="end" aria-label="activate-user">
                                    <PersonAddIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    }
                </ListItem>
            );
        });
        this.setState({techList: techList});
        return techList;

    }

    handleUpdateUser(e,active_user, technician_ID){
        e.preventDefault();

        fetch('users/updateUser', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                active_user: active_user,
                technician_ID: technician_ID
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "User updated") {
                    // alert("User Updated");
                    NotificationManager.success('User Updated!', '', 2000);
                } else {
                    alert("Error updating user");
                    this.setState({ submitted: true });
                    NotificationManager.error('Error Updating User', '', 2000);
                }
            });

        setTimeout(() => {
            this.props.history.push('/');
        }, 2000);

    }

    createUserHandler(){
        this.props.history.push('/CreateUser');
    }

    render() {
        //styles
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#FFA500' }, // orange
                secondary: { main: '#25551b' } // dark green
            },
        });
        return (
            <MuiThemeProvider theme={theme}>
                <NotificationContainer />
                <Paper>
                    <List dense={'dense'}>
                        <ListItem> <h3> Manage Users </h3></ListItem>
                        <ListItem>
                            <ListItemText
                                primary= {"Add Technician"} />
                                <Tooltip title={"Add User"}  aria-label={"add-user"}>
                                    <Fab
                                    aria-label="add"
                                    color="secondary"
                                    size="small"
                                    onClick={this.createUserHandler}
                                    >
                                        <AddIcon/>
                                    </Fab>
                                </Tooltip>
                        </ListItem>
                        {this.state.techList}
                    </List>
                </Paper>
            </MuiThemeProvider>
        );
    }
}

export default ManageUsers;