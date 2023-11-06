import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Paper
} from '@mui/material';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import UserComments from './components/userComments/userComments';
import SinglePhoto from './components/singlePhoto/singlePhoto';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_content: undefined,
      advanced_features: false
    };
    this.changeMainContent = this.changeMainContent.bind(this);
    this.toggleAdvancedFeatures = this.toggleAdvancedFeatures.bind(this);
  }

  changeMainContent = (main_content) => {
    this.setState({ main_content: main_content });
  };

  toggleAdvancedFeatures() {
    this.setState({
      advanced_features: !this.state.advanced_features
    });
  }

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <TopBar main_content={this.state.main_content} toggle_feature={this.toggleAdvancedFeatures}/>
        </Grid>
        <div className="main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList advanced_features={this.state.advanced_features}/>
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Switch>
              <Route path="/users/:userId"
                     render={ props => <UserDetail {...props} changeMainContent={this.changeMainContent}/> }
              />
              <Route path="/photos/:userId"
                     render ={ props => <UserPhotos {...props} changeMainContent={this.changeMainContent}/> }
              />
              <Route path="/comments/:userId"
                     render ={ props => <UserComments {...props} changeMainContent={this.changeMainContent} advanced_features={this.state.advanced_features}/> }
              />
              <Route path="/single-photo/:photoId"
                     render ={ props => <SinglePhoto {...props} changeMainContent={this.changeMainContent} advanced_features={this.state.advanced_features}/> }
                  />
              <Route path="/admin/login/:userName"
                     render ={ props => <SinglePhoto {...props} changeMainContent={this.changeMainContent} advanced_features={this.state.advanced_features}/> }
              />
              <Route path="/admin/logout/:username"
                     render ={ props => <SinglePhoto {...props} changeMainContent={this.changeMainContent} advanced_features={this.state.advanced_features}/> }
              />  
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(
  <PhotoShare/>,
  document.getElementById('photoshareapp')
);
