import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import './userList.css';

/**
 * Define UserList, a React component of project #5
 */

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //create an empty array for users
      users: [], 
    };
  }

  componentDidMount() {
    //get the list of users when the component mounts
    const users = window.models.userListModel();
    //update the components state
    this.setState({ users });
  }

  render() {
    return (
      <div className = "details">
        <List component="nav">
          {/*map over the list to create list items displayed on the left*/}
          {this.state.users.map((user) => (
            <div key={user._id}>
              {/*create list item with link to user's userDetail page*/}
              <ListItem button component={Link} to={`/users/${user._id}`}>
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </div>
    );
  }
}

export default UserList;
