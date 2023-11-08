import React from "react";
import {
  Button,
  TextField,
  ImageList,
  ImageListItem,
  Collapse,
} from "@mui/material";
import "./userPhotos.css";
import axios from "axios";

/**
 * Define UserPhotos, a React componment of project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: undefined,
      photos: undefined,
      new_comment: "",
      comment_form: null,
      saving_comment: false,
    };
  }

  componentDidMount() {
    const new_user_id = this.props.match.params.userId;
    this.handleUserChange(new_user_id);
  }

  componentDidUpdate() {
    const new_user_id = this.props.match.params.userId;
    const current_user_id = this.state.user_id;
    if (current_user_id !== new_user_id) {
      this.handleUserChange(new_user_id);
    }
  }

  handleUserChange(user_id) {
    axios.get("/photosOfUser/" + user_id).then((response) => {
      this.setState({
        user_id: user_id,
        photos: response.data,
      });
    });
    axios.get("/user/" + user_id).then((response) => {
      const new_user = response.data;
      const main_content =
        "User Photos for " + new_user.first_name + " " + new_user.last_name;
      this.props.changeMainContent(main_content);
    });
  }

  creatingComment(photo_id, newComment) {
    this.setState({ saving_comment: true });
    axios
      .post(`/commentsOfPhoto/${photo_id}`, newComment)
      .then((response) => {
        this.setState({ comment_form: null, new_comment: "" });
        this.handleUserChange(this.state.user_id);
      })
      .catch((err) => {
        console.error("err", err);
      })
      .finally(() => {
        this.setState({ saving_comment: false });
      });
  }

  render() {
    return this.state.user_id ? (
      <div>
        <div>
          <Button
            variant="contained"
            component="a"
            href={"#/users/" + this.state.user_id}
          >
            User Detail
          </Button>
        </div>
        <ImageList variant="masonry" cols={1} gap={8}>
          {this.state.photos.map((item) => (
            <div key={item._id}>
              <TextField
                id="date"
                label="Photo Date"
                variant="outlined"
                disabled
                fullWidth
                margin="normal"
                value={item.date_time}
              />
              <ImageListItem key={item.file_name}>
                <img
                  src={`images/${item.file_name}`}
                  srcSet={`images/${item.file_name}`}
                  alt={item.file_name}
                  loading="lazy"
                />
              </ImageListItem>
              {item.comments ? (
                item.comments.map((comment) => (
                  <div key={comment._id}>
                    <TextField
                      id="date"
                      label="Comment Date"
                      variant="outlined"
                      disabled
                      fullWidth
                      margin="normal"
                      value={comment.date_time}
                    />
                    <TextField
                      id="user"
                      label="User"
                      variant="outlined"
                      disabled
                      fullWidth
                      margin="normal"
                      value={
                        comment.user.first_name + " " + comment.user.last_name
                      }
                      component="a"
                      href={"#/users/" + comment.user._id}
                    />
                    <TextField
                      id="comment"
                      label="Comment"
                      variant="outlined"
                      disabled
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      value={comment.comment}
                    />
                  </div>
                ))
              ) : (
                <div>
                  <TextField
                    id="comment"
                    label="No Comments"
                    variant="outlined"
                    disabled
                    fullWidth
                    margin="normal"
                  />
                </div>
              )}
              {/* add comment form*/}
              <div>
                {/* show form if comment_form is equal to this item */}
                <Collapse in={this.state.comment_form == item._id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={this.state.new_comment}
                      onChange={(event) => {
                        this.setState({ new_comment: event.target.value });
                      }}
                      margin="normal"
                      placeholder="start typing..."
                    />
                    <Button
                      onClick={() => {
                        this.creatingComment(item._id, {
                          comment: this.state.new_comment,
                        });
                      }}
                      variant="contained"
                      style={{ marginLeft: "4px" }}
                      loading={this.state.saving_comment}
                    >
                      Save
                    </Button>
                  </div>
                </Collapse>
                <Button
                  onClick={() => {
                    this.setState(({ comment_form }) => ({
                      comment_form:
                        comment_form == item._id
                          ? null // if comment_form equals this item, set comment_form to null to close this form
                          : item._id, // if not, set comment_form to this item to open this form and close all others
                    }));
                  }}
                  variant="outlined"
                >
                  {this.state.comment_form == item._id
                    ? "Cancel"
                    : "Add Comment"}
                </Button>
              </div>
            </div>
          ))}
        </ImageList>
      </div>
    ) : (
      <div />
    );
  }
}

export default UserPhotos;
