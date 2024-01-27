import * as React from 'react';
import {AppBar, Box, Typography, Container, Grid } from '@mui/material';

import './Header.css';

export const Header = () => {
  return (
    <Box >
      <AppBar
            position="static"
            elevation={3}
            className='appBar'
      >
        <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 0.5, mb: 0.5 }}>
          <Grid item>
            <img src="/images/Gerb_goroda_Sumy2.png" className='logo' alt="Logo" />
          </Grid>
          <Grid item>
            <Typography variant="h6" align='center' >
              СУМСЬКИЙ МІСЬКИЙ 
            </Typography>
            <Typography variant="h6" align='center' sx={{ mb: 2 }}>
              ЦЕНТР СОЦІАЛЬНИХ СЛУЖБ
            </Typography>
          </Grid>
        </Grid>
      </AppBar>
    </Box>
  );
}