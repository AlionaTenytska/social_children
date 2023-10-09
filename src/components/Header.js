import * as React from 'react';
import {AppBar, Box, Typography, Container } from '@mui/material';

import './Header.css';

export const Header = () => {
  return (
    <Box >
      <AppBar
            position="static"
            elevation={3}
            className='appBar'
      >
        <img src="/images/sumy.png"  className='logo'/>
        <Typography variant="h6" align='center' sx={{mb: 2}}>
            УПРАВЛІННЯ "СЛУЖБА У СПРАВАХ ДІТЕЙ"
        </Typography>
      </AppBar>
    </Box>
  );
}