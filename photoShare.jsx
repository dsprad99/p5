import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper
} from '@mui/material';
import './styles/main.css';

import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import UserComments from './components/userComments/userComments';
import SinglePhoto from './components/singlePhoto/singlePhoto';
import LoginRegister from './components/login/login';
class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      main_content: undefined,
      advanced_features: false,
      loggedInUser: null 
    };
    this.changeMainContent = this.changeMainContent.bind(this);
    this.toggleAdvancedFeatures = this.toggleAdvancedFeatures.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  /*set our logged in user value to the value of our current user */
  handleLogin(user) {
    this.setState({ loggedInUser: user });
  }

  /*set our logged in user value to null since no user is logged in*/
  handleLogout() {
    this.setState({ loggedInUser: null });
  }

  changeMainContent(main_content) {
    this.setState({ main_content: main_content });
  }

  toggleAdvancedFeatures() {
    this.setState({
      advanced_features: !this.state.advanced_features
    });
  }

  render() {
    const { loggedInUser } = this.state;

    return (
      <HashRouter>
        <div>
          <TopBar
          main_content={this.state.main_content}
          toggle_feature={this.toggleAdvancedFeatures}
          onLogin={this.handleLogin}
          onLogout={this.handleLogout}
          loggedInUser={this.state.loggedInUser}
          advanced_features={this.state.advanced_features}
        />
          <div className="main-topbar-buffer"/>
            <Switch>
            <Route exact path="/">
              {loggedInUser ? <Redirect to={`/users/${loggedInUser._id}`} /> : <Redirect to="/login" />}
            </Route>

            {/* New Login Route */}
            <Route path="/login"
                   render={(props) => <LoginRegister {...props} onLogin={this.handleLogin} />}
            />

            {/* Only render UserList and detail views if logged in */}
            {loggedInUser && (
              <>
              <Grid container spacing={8}>
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
                      {/*Will act like our else statement in this case where if 
                      our route matches no other while a user is logged in it just reroutes to there login*/}
                      <Route
                        render={() => <Redirect to={`/users/${loggedInUser._id}`} />}
                      />
                    </Switch>
                  </Paper>
                </Grid>
                </Grid>
                </>
            )}
            {/*If no users are logged in we will just redirect to our login page getting any 
            bad URLs to prevent deep links*/}
            <Route render={() => <Redirect to="/login" />}/>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(
  <PhotoShare/>,
  document.getElementById('photoshareapp')
);
