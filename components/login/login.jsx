import React, { useState } from 'react';
import { Box, Grid, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function LoginRegister(props) {
  /*state hook to help manage credential as default will be empty*/
  const [registerCredentials, setRegisterCredentials] = useState({
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      location: '',
      description: '',
      occupation: '',
  });

  const [loginCredentials, setLoginCredentials] = useState({
      loginUsername: '',
      loginPassword: '',
  });
  /*set the state for our error as false to start*/
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [openSuccessfulSnackbar, setOpenSuccessfulSnackbar] = useState(false); 
  const [error, setError] = useState(''); 

  /*event handler to update the state with new input for login*/
  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginCredentials({ ...loginCredentials, [name]: value });
  };

  /*event handler to update the state with new input for register*/
  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterCredentials({ ...registerCredentials, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      /*send post request to try and log in*/
      const response = await axios.post('/admin/login', {
        username: loginCredentials.loginUsername,
        password: loginCredentials.loginPassword,
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
        if (registerCredentials.password !== registerCredentials.confirmPassword) {
            setError('Passwords do not match');
            setOpenSnackbar(true);
            return;
        }
        try {
            await axios.post('/user', {
                login_name: registerCredentials.username,
                password: registerCredentials.password,
                first_name: registerCredentials.firstName,
                last_name: registerCredentials.lastName,
                location: registerCredentials.location,
                description: registerCredentials.description,
                occupation: registerCredentials.occupation,
            });
            // Handle successful registration, clear form fields, show success message
            setRegisterCredentials({
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
            setOpenSuccessfulSnackbar(true);
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

  const handleCloseSuccessfulSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessfulSnackbar(false);
    setError('');
  };

  return (
    <Grid component="form" container onSubmit={handleLogin} noValidate spacing={3}>
      <Grid component="div" item onSubmit={handleLogin} noValidate xs>
        <Box component="div" noValidate sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', 
      }}>
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <TextField
          margin="normal"
          required
          label="Username"
          name="loginUsername"
          autoComplete="username"
          value={loginCredentials.loginUsername}
          onChange={handleLoginChange}
          />

          <TextField
              margin="normal"
              required
              label="Password"
              name="loginPassword"
              type="password"
              autoComplete="current-password"
              value={loginCredentials.loginPassword}
              onChange={handleLoginChange}
              />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 3 }}
          onChange={handleLogin}  
          >
          Log In
        </Button>
        </Box>
      </Grid>
      <Grid component="div" item noValidate xs>
        <Box component="div" noValidate sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', 
      }}>

        <Typography component="h1" variant="h5">
            Register
        </Typography>
         
        <TextField
            margin="normal"
            required
            label="First Name"
            name="firstName"
            autoComplete="first-name"
            value={registerCredentials.firstName}
            onChange={handleRegisterChange}
            />
        <TextField
            margin="normal"
            required
            label="Last Name"
            name="lastName"
            autoComplete="last-name"
            value={registerCredentials.lastName}
            onChange={handleRegisterChange}
            />
        <TextField
            margin="normal"
            label="Location"
            name="location"
            autoComplete="location"
            value={registerCredentials.location}
            onChange={handleRegisterChange}
            />
        <TextField
            margin="normal"
            label="Description"
            name="description"
            autoComplete="off"
            value={registerCredentials.description}
            onChange={handleRegisterChange}
            />
        <TextField
            margin="normal"
            label="Occupation"
            name="occupation"
            autoComplete="occupation-title"
            value={registerCredentials.occupation}
            onChange={handleRegisterChange}
            />
         <TextField
            margin="normal"
            required
            label="Username"
            name="username"
            autoComplete="username"
            value={registerCredentials.username}
            onChange={handleRegisterChange}
            />
        <TextField
            margin="normal"
            required
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={registerCredentials.password}
            onChange={handleRegisterChange}
            />
        <TextField
            margin="normal"
            required
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="current-password"
            value={registerCredentials.confirmPassword}
            onChange={handleRegisterChange}
            />
        <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleRegister}
        >
            Register Me
        </Button>
        </Box>
      </Grid>

      <Snackbar
      open={openSnackbar}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
      <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '90%' }}>
          {error}
      </Alert>
      </Snackbar>

      <Snackbar
      open={openSuccessfulSnackbar}
      onClose={handleCloseSuccessfulSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
      <Alert onClose={handleCloseSuccessfulSnackbar} severity="error" sx={{ width: '90%' }}>
          {error}
      </Alert>
      </Snackbar>
    </Grid>
  );
}

export default LoginRegister;




  

