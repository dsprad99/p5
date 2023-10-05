import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Link,
} from '@mui/material';
import './userPhotos.css';

/**
 * Define UserPhoto, a React component of project #5
 */

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //create a blank user object
      user: null,
      //create an empty array for photos
      photos: [],
    };
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    //get the list of user when the component mounts
    const user = window.models.userModel(userId);
    //get the list of photos that belong to a user
    const photos = window.models.photoOfUserModel(userId);
    this.setState({ user, photos });
  }

  render() {
    const {user, photos} = this.state;

    return (
      <div className = "details">
        {/*As long as a user exists and theres user data*/}
        {user && (
          <Typography variant="h2">{`Photos of ${user.first_name}`}</Typography>
        )}
        {/*map over the users photos to create cards*/}
        {photos.map((photo) => (
          //create a card components for each users photo
          <Card key={photo._id} className="photo-card">
            {/*create a card head for each users card component*/}
            <CardHeader
              subheader={`Date posted: ${photo.date_time}`}
            />
            {/*create a card image for each users card component*/}
            <CardMedia
              className = "userPicture"
              component="img"
              src={`images/${photo.file_name}`
              } 
              />
            {/*create a cards comments associated with the specific picture*/}
            <CardContent>
              <Typography variant="h4">Comments:</Typography>
                {Array.isArray(photo.comments) && photo.comments.length > 0 ? (
                  photo.comments.map((comment) => (
                    <div key={comment._id}>
                      <Typography variant="subtitle2" component="">
                        <Link to={`/users/${comment.user._id}`}>
                          {`${comment.user.first_name} ${comment.user.last_name}`}
                        </Link>{' '} - {`Date created: ${comment.date_time}`}
                      </Typography>
                      <Typography variant="subtitle2">{comment.comment}</Typography>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2">No comments at this time.</Typography>
                )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

export default UserPhotos;
