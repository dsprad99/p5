import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import "./userDetail.css";
import axios from "axios";

/**
 * Define UserDetail, a React component of project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //set the state for the user
      user: undefined,
      //set the state for the mostCommentedPhoto
      mostCommentedPhoto: null,
      //set the state for the most recentPhoto
      mostRecentPost: null,
    };
  }
  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
  }

  componentDidUpdate() {
    const new_user_id = this.props.match.params.userId;
    const current_user_id = this.state.user?._id;
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    axios.get("/user/" + user_id).then((response) => {
      const { user, mostRecentPost, mostCommentedPhoto } = response.data;
      //set the state of the user, most recent photo posted, and most commented photo
        this.setState({
          user: user,
          mostCommentedPhoto: mostCommentedPhoto,
          mostRecentPost: mostRecentPost,
        });
      const main_content =
        "User Details for " + user.first_name + " " + user.last_name;
      this.props.changeMainContent(main_content);
    });
  }

  render() {
    const { user, mostRecentPost, mostCommentedPhoto } = this.state;

  return user ? (
    <Box component="form" noValidate autoComplete="off">
          <div>
            <TextField id="first_name" label="First Name" variant="outlined" disabled fullWidth margin="normal" value={this.state.user.first_name}/>
          </div>
          <div>
            <TextField id="last_name" label="Last Name" variant="outlined" disabled fullWidth margin="normal" value={this.state.user.last_name}/>
          </div>
          <div>
            <TextField id="location" label="Location" variant="outlined" disabled fullWidth margin="normal" value={this.state.user.location}/>
          </div>
          <div>
            <TextField id="description" label="Description" variant="outlined" multiline rows={4} disabled fullWidth margin="normal" value={this.state.user.description}/>
          </div>
          <div>
            <TextField id="occupation" label="Occupation" variant="outlined" disabled fullWidth margin="normal" value={this.state.user.occupation}/>
          </div>
      <Grid container spacing={2}>
        
        {mostCommentedPhoto && (
            <Grid item xs={6} md={8} style={{height: '40%', width: '50%', margin: '0 auto' }}>
              <Button variant="contained" component="a" href={"#/photos/" + this.state.user._id} style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }} >
                <img src={"/images/" + mostCommentedPhoto.file_name} style={{ width: '20%', height: '30%', marginRight: '7px' }} />
                <p>Number of Comments: {mostCommentedPhoto.comments.length}</p>
              </Button>
            </Grid>
          )}


          {mostRecentPost && (
            <Grid item xs={6} md={8} style={{ height: '40%', width: '50%', margin: '0 auto' }}>
              <Button variant="contained" component="a" href={"#/photos/" + this.state.user._id} style={{ display: 'flex', alignItems: 'center', textAlign: 'left' }}>
                <img src={"/images/" + mostRecentPost.file_name} style={{ width: '20%', height: '30%', marginRight: '10px' }}/>
                <p>Posted on: {new Date(mostRecentPost.date_time).toLocaleString()}</p>
              </Button>
            </Grid>
        )}
      </Grid>
    </Box>
    ) : (
      <div />
    );
  }
}

export default UserDetail;

