import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const LoginRegister = (props) => {
   {/*state hook to help manage credential as default will be empty*/ }
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  {/*set the state for our error as false to start*/}
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [error, setError] = useState(''); 

  {/*event handler to update the state with new input*/}
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      {/*send post request to try and log in*/}
      const response = await axios.post('/admin/login', {
        username: credentials.username,
      });
      props.onLogin(response.data.user);
      {/*opens the logged in users details up first*/}
      props.history.push(`/users/${response.data.user._id}`);
    }
    
    //if theres a catch then a username was incorrectly entered
    catch (error) {
      setError('Login failed. Please try again.'); 
      {/*show our error*/}
      setOpenSnackbar(true); 
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        flexDirection: 'column', 
      }}>
      <Typography component="h1" variant="h5">
        Log In
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        autoComplete="username"
        value={credentials.username}
        onChange={handleChange}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 3 }}
      >
        Log In
      </Button>
      <Snackbar
      open={openSnackbar}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
      <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '90%' }}>
          {error}
      </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginRegister;



  
  

