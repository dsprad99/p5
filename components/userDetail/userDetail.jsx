import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import {
  Typography,
  Button,
} from '@mui/material';
import './userDetail.css';


/**
 * Define UserDetail, a React component of project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //create a blank user object
      user: null,
    };
  }

  componentDidMount() {
    //get the userID from route parameters
    const userId = this.props.match.params.userId;
    const user = window.models.userModel(userId);
    //update components state with user data
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    return (
      <div className="details">
        {/*if the user object does exist....*/}
        {user ? (
          <div>
            <Typography variant="h2">{user.first_name} {user.last_name}</Typography>
            <Typography className="location" variant="h6">Location: {user.location}</Typography>
            <Typography variant="body2">Description: {user.description}</Typography>
            <Typography variant="body2">Occupation: {user.occupation}</Typography>
            <Button
              variant="contained"
              component={Link}
              to={`/photos/${user._id}`}>
              View Personal Page
            </Button>
          </div>
          //if no user then nothing is displayed
        ) : null}
      </div>
    );
  }
       
}

export default UserDetail;
