// components/Login.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';

const Login = (props) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  
  const handleChange = (event) => {
    const { userName } = event.target;
    setCredentials({ credentials, userName});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
      try {
        //pass in our credentials to the post request
      const response = await axios.post('/admin/login/', credentials);
      //handle response
      console.log(response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
    };
    
    const handleLogout = async (event) => {
        event.preventDefault();
        try {
            //pass in our credentials to the post request
        const response = await axios.post('/admin/logout/', credentials);
        //handle response
        console.log(response.data);
        } catch (error) {
        console.error('Login failed:', error);
        }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={credentials.username}
        onChange={handleChange}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default Login;
