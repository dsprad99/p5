import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Checkbox, Button
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';
import { Type } from 'js-yaml';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app_info: undefined
        };

        this.toggleFeature = props.toggle_feature;
        this.handleLogout = this.handleLogout.bind(this); 
    }

    componentDidMount() {
        this.handleAppInfoChange();
    }

    handleAppInfoChange() {
        const { app_info } = this.state;
        if (app_info === undefined) {
            axios.get("/test")
                .then((response) => {
                    this.setState({
                        app_info: response.data.info
                    });
                })
                .catch(error => {
                    console.log("Error fetching app info:", error);
                });
        }
    }

    handleLogout = async () => {
        try {
            await axios.post('/admin/logout');
            {/*this will update our parent components state*/}
            this.props.onLogout(); 
            {/*redirect our current view to the login view after logged out*/}
            this.props.history.push('/login'); 
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    render() {
        {/*get the loggedInUser passed from props*/}
        const { loggedInUser, advanced_features } = this.props; 

        return (
            <AppBar className="topbar-appBar" position="absolute">
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        Software Co
                    </Typography>
                    {loggedInUser && (
                        <React.Fragment>
                            {/*display the logged in users first name*/}
                            <Typography component="h5" sx={{ flexGrow: 1 }}>
                                {/* display the first name of our logged in user */}
                                Hi, {loggedInUser.first_name} 
                            </Typography>
                            <Typography variant="span" component="div" sx={{ flexGrow: 1 }}>
                                Advanced Features
                                <Checkbox color="default" onChange={this.toggleFeature} checked={advanced_features}></Checkbox>
                            </Typography>
                            {/*log out button*/}
                            <Button variant="contained" color="error" onClick={this.handleLogout} sx={{ m: 2 }}>
                                Logout
                            </Button>
                            <Typography sx={{ flexGrow: 1 }}></Typography>
                        </React.Fragment>
                    )}
                    <Typography sx={{ flexGrow: 3 }}></Typography>
                    {this.state.app_info && (
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Version: {this.state.app_info.__v}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
        );
    }
}

export default withRouter(TopBar);


