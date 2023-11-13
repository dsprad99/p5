import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function LoginRegister = (props) => {
   /*state hook to help manage credential as default will be empty*/
  const [credentials, setCredentials] = useState({
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      location: '',
      description: '',
      occupation: '',
  });
  /*set the state for our error as false to start*/
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [error, setError] = useState(''); 

  /*event handler to update the state with new input*/
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      /*send post request to try and log in*/
      const response = await axios.post('/admin/login', {
        username: credentials.username,
          password: credentials.password,
      });
      props.onLogin(response.data.user);
      /*opens the logged in users details up first*/
      props.history.push(`/users/${response.data.user._id}`);
    }
    
    //if theres a catch then a username was incorrectly entered
    catch (error) {
      setError('Login failed. Please try again.'); 
      /*show our error*/
      setOpenSnackbar(true); 
    }
  };

    const handleRegister = async (event) => {
        event.preventDefault();
        // Check if passwords match
        if (credentials.password !== credentials.confirmPassword) {
            setError('Passwords do not match');
            setOpenSnackbar(true);
            return;
        }
        try {
            await axios.post('/user', {
                login_name: credentials.username,
                password: credentials.password,
                first_name: credentials.firstName,
                last_name: credentials.lastName,
                location: credentials.location,
                description: credentials.description,
                occupation: credentials.occupation,
            });
            // Handle successful registration, clear form fields, show success message
            setCredentials({
                username: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                location: '',
                description: '',
                occupation: '',
            });
            setError('Registration successful');
            setOpenSnackbar(true);
            // eslint-disable-next-line no-shadow
        } catch (error) {
            setError('Registration failed. Please check your information.');
            setOpenSnackbar(true);
        }
    };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setError('');
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

        <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={credentials.password}
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

        <Typography component="h1" variant="h5">
            Register
        </Typography>
        <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="firstName"
            autoComplete="first-name"
            value={credentials.firstName}
            onChange={handleChange}
        />
        <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="lastName"
            autoComplete="last-name"
            value={credentials.lastName}
            onChange={handleChange}
        />
        <TextField
            margin="normal"
            fullWidth
            label="Location"
            name="location"
            autoComplete="location"
            value={credentials.location}
            onChange={handleChange}
        />
        <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            autoComplete="off"
            value={credentials.description}
            onChange={handleChange}
        />
        <TextField
            margin="normal"
            fullWidth
            label="Occupation"
            name="occupation"
            autoComplete="occupation-title"
            value={credentials.occupation}
            onChange={handleChange}
        />
        <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
        />
        <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="current-password"
            value={credentials.confirmPassword}
            onChange={handleChange}
        />
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleRegister}
        >
            Register Me
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



  

