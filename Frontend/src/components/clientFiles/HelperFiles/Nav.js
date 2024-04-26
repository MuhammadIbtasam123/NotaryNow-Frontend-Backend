import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import logoImg from "../../../assets/images/logo.png";
// import profilePic from "../../../assets/images/ibtasam-fyp.jpg";
import { Button } from "@mui/material";
import "./HelperStyle.css";

const Nav = ({ User }) => {
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
              <img src={logoImg} alt="" />
            </Typography>
          </Box>

          <Typography variant="h6" className="dashboard">
            {`${User}'s Dashboard`}
          </Typography>

          <Box className="profile-box">
            <Button
              className="sign-out"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/LoginClient";
              }}
            >
              Sign Out
            </Button>
            {/* <img src={profilePic} alt="" className="profile-pic" /> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Nav;
