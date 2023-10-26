import React from "react";
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import { List, ListSubheader, ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';

/**
* Define UserComments, a React componment of project #6
*/
class UserComments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: undefined,
			user_photos: undefined
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
	
	handleUserChange(user_id){
		axios.get("/photosOfUser/" + user_id)
		.then((response) =>
		{
			this.setState({
				user_id : user_id,
				user_photos: response.data
			});
			console.log(this.state.user_photos);
		});
		axios.get("/user/" + user_id)
		.then((response) =>
		{
			const new_user = response.data;
			const main_content = "User Comments for " + new_user.first_name + " " + new_user.last_name;
			this.props.changeMainContent(main_content);
		});
	}
	
	render() {
		return this.state.user_photos ? (
			<>
			{this.props.advanced_features ? <div></div> : <Redirect to={"/users/" + this.state.user_id}></Redirect> }
			<List component="div" sx={{width: '100%'}}>
				<ListSubheader>Comments:</ListSubheader>
				{this.state.user_photos.map(photo => (
					photo.comments.map(comment => (
						<Link key={comment._id} to={"/single-photo/" + photo._id} style={{textDecoration: 'none', color: 'inherit'}}>
							<ListItemButton alignItems="center">
								<ListItemAvatar sx={{padding: "1em"}}>
									<Avatar alt={photo.file_name} sx={{height: "100px", width: "100px"}} variant="rounded" src={"/images/" + photo.file_name}/>
								</ListItemAvatar>
								<ListItemText primary={comment.comment}/>
							</ListItemButton>
						</Link>
					))
				))}
			</List>
			</>
		) : <div></div>;
	}
}

export default UserComments;
