import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Checkbox, Button, Alert, Snackbar
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';
import { Type } from 'js-yaml';

class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app_info: undefined,
            photo_upload_show: false,
            photo_upload_error: false,
            photo_upload_success: false
        };

        this.toggleFeature = props.toggle_feature;
        this.handleLogout = this.handleLogout.bind(this); 
        this.handleNewPhoto = this.handleNewPhoto.bind(this);
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

    handleNewPhoto = (e) => {
        e.preventDefault();
        if (this.uploadInput.files.length > 0) {
            const domForm = new FormData();
            domForm.append('uploadedphoto', this.uploadInput.files[0]);
            axios.post("/photos/new", domForm)
                .then((response) => {
                    this.setState({
                        photo_upload_show: true,
                        photo_upload_error: false,
                        photo_upload_success: true
                    });
                })
                .catch(error => {
                    this.setState({
                        photo_upload_show: true,
                        photo_upload_error: true,
                        photo_upload_success: false
                    });
                    console.log(error);
                });
        }
    }
    
    handleClose = () => {
        this.setState({
            photo_upload_show: false,
            photo_upload_error: false,
            photo_upload_success: false
        });
    }

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
                            <Button component="label" variant="contained">
                                Add Photo
                                <input type="file" accept = "image/*" hidden ref={(domFileRef) => { this.uploadInput = domFileRef; }} onChange={this.handleNewPhoto}/>
                            </Button>
                            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'left'}} open={this.state.photo_upload_show} autoHideDuration={6000} onClose={this.handleClose}>
                                {
                                    this.state.photo_upload_success ?
                                        <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>Photo Uploaded</Alert> :
                                        this.state.photo_upload_error ?
                                            <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>Error Uploading Photo</Alert> :
                                            <div/>
                                }
                            </Snackbar>
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


