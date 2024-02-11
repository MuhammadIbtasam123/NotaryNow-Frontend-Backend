import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import logoImg from '../../assets/images/logo.png';
import './homeStyles.css';
// import { Route, Switch, Link } from 'react-router-dom';

function ResponsiveAppBar({setButtonType}) {
  const pages=['Home', 'About Us', 'How it works', 'Team', 'Contact'];
  // funtions 
  function generateMenuButtons(pages) {
    return pages.map((page) => (
      <Button
        key={page}
        className="menu-button"
        onClick={() => setButtonType(page)}
      >
        {page}
      </Button>
    ));
  }
  return (
    <AppBar className="app-bar">
      <Container maxWidth="xl">
        <Toolbar disableGutters className="toolbar">
          <Box>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              className="logo"
            >
              <img src={logoImg} alt="Logo" />
            </Typography>
          </Box>
          <Box>
            <Box className="menu-buttons">
              {generateMenuButtons(pages)}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
