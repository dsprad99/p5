import React from 'react';
import {
    AppBar, Toolbar, Typography, Checkbox
} from '@mui/material';
import './TopBar.css';
import axios from 'axios';


/**
 * Define TopBar, a React componment of project #5
 */
class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app_info: undefined
        };

        this.toggleFeature = props.toggle_feature;
    }

    componentDidMount() {
        this.handleAppInfoChange();
    }

    handleAppInfoChange(){
        const app_info = this.state.app_info;
        if (app_info === undefined){
            axios.get("/test")
                .then((response) =>
                {
                    this.setState({
                        app_info: response.data.info
                    });
                });
        }
    }

  render() {
    return this.state.app_info ? (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>Software Co</Typography>
            <Typography variant="span" component="div" sx={{ flexGrow: 1 }}>Advanced Features
            <Checkbox color="default" onChange={this.toggleFeature}></Checkbox>
            </Typography>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} color="inherit">{this.props.main_content}</Typography>
            <Typography variant="h5" component="div" color="inherit">Version: {this.state.app_info.__v}</Typography>
        </Toolbar>
      </AppBar>
    ) : (
        <div/>
    );
  }
}

export default TopBar;
