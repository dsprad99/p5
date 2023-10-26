import React from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { List, ListItemButton, ListItemText, Avatar, ListItemIcon } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

/**
* Define UserComments, a React componment of project #6
*/
class SinglePhoto extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			photo_id: undefined,
			photo: undefined
		};
	}
	
	componentDidMount() {
		const new_photo_id = this.props.match.params.photoId;
		this.handleUserChange(new_photo_id);
	}
	
	componentDidUpdate() {
		const new_photo_id = this.props.match.params.photoId;
		const current_photo_id = this.state.photo_id;
		if (current_photo_id !== new_photo_id) {
			this.handleUserChange(new_photo_id);
		}
	}
	
	handleUserChange(photo_id){
		axios.get("/photo/" + photo_id)
		.then((response) =>
		{
			this.setState({
				photo_id : photo_id,
				photo: response.data
			});
			console.log(this.state.photo);
			const main_content = "Single Photo for " + this.state.photo.file_name;
			this.props.changeMainContent(main_content);
		});
	}
	
	render() {
		return this.state.photo ? (
			<>
			{this.props.advanced_features ? <div></div> : <Redirect to="/"></Redirect> }
			<List component="div" sx={{width: '100%'}}>
				<Avatar alt={this.state.photo.file_name} sx={{height: "auto", width: "100%"}} variant="rounded" src={"/images/" + this.state.photo.file_name}/>
				{this.state.photo.comments.map(comment => (
					<ListItemButton key={comment._id} alignItems="center">
						<ListItemIcon>
							<CommentIcon/>
						</ListItemIcon>
						<ListItemText primary={comment.user.first_name + " " + comment.user.last_name} secondary={comment.comment}/>
					</ListItemButton>
				))}
			</List>
			</>
		) : <div></div>;
	}
}

export default SinglePhoto;
