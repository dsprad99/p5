import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemText,
  Chip
}
from '@mui/material';
import './userList.css';
import axios from 'axios';

/**
 * Define UserList, a React component of project #5
 */
class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                users: undefined,
                user_id: undefined,
                usersPropsCounted: {}
            };
    }

  componentDidMount() {
    this.handleUserListChange();
  }

  componentDidUpdate() {
    const new_user_id = this.props.match?.params.userId;
    //console.log(new_user_id);
    const current_user_id = this.state.user_id;
    //console.log(current_user_id);
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    this.setState({
      user_id: user_id,
    });
  }

    handleUserListChange(){
        axios.get("/user/list")
            .then((response) =>
            {
                this.setState({
                    users: response.data
                });
                this.getUserPropsCount();
            });
    }

    getUserPropsCount() {
        let tempState = {};
        this.state.users.forEach(user => {
            axios.get("/photosOfUser/" + user._id).then((res)=>{
                let commentCount = 0;
                let photoCount = 0;
                for (let photo of res.data) {
                    if (photo.comments) commentCount += photo.comments.length;
                    photoCount++;
                }
                tempState[user._id] = {};
                tempState[user._id].commentCount = commentCount;
                tempState[user._id].photoCount = photoCount;
            });
        });
        this.setState({usersPropsCounted: tempState});
    }

  render() {
    return this.state.users ? (
      <div>
        <List component="nav">
            {
                this.state.users.map(user => (
                <ListItemButton selected={this.state.user_id === user._id}
                                key={user._id}
                                divider={true}
                                component="a" href={"#/users/" + user._id}>
                    <ListItemText primary={user.first_name + " " + user.last_name} />
                    {this.props.advanced_features ? (
                        <>
                            <Chip color="success" label={this.state.usersPropsCounted[user._id].photoCount}/>
                            <NavLink to="/">
                                <Chip color="error" label={this.state.usersPropsCounted[user._id].commentCount}/>
                            </NavLink>
                        </>
                    ) : (<div/>)}
                </ListItemButton>
            ))
            }
        </List>
      </div>
    ) : (
      <div />
    );
  }
}

export default UserList;
