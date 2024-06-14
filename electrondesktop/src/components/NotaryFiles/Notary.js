import * as React from "react";
import {
  styled,
  Stack,
  Button,
  Box,
  Paper,
  Grid,
  Nav,
  AppBar,
} from "./muiComponents";

// Now you can use these components in your main file

import Profile from "./MainFiles/Profile";
import UnconfirmAppointments from "./MainFiles/UnconfirmAppointments";
import UpcomingAppointmnets from "./MainFiles/UpcomingAppointments";
import NoatrizedDocuments from "./MainFiles/NotarizedDocuments";
import AvailabilityForm from "./MainFiles/Availability";
import Missing from "./MainFiles/Missing";
import preview from "./MainFiles/Preview";
import EditPdfView from "./HelperFiles/EitPdfView";

import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import * as UserStyles from "./NotaryStyle";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Notary = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Router>
        <Grid container spacing={6} columnSpacing={2}>
          <Grid xs={12} md={12}>
            <Item>
              <Nav User="Notary" />
            </Item>
          </Grid>
          <Grid xs={6} md={2.5}>
            <AppBar sx={UserStyles.NavBar}>
              <Item sx={UserStyles.NavItem}>
                {/* Buttons */}
                <Stack
                  direction="column"
                  spacing={5}
                  sx={{ marginTop: "1rem" }}
                >
                  <Link to="/Notary">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Profile
                    </Button>
                  </Link>
                  <Link to="/Notary/Availability">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Availability Form
                    </Button>
                  </Link>
                  <Link to="/Notary/Unconfirm-Appointments">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Unconfirm Appointments
                    </Button>
                  </Link>
                  <Link to="/Notary/Upcoming-Appointments">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Upcoming Appointments
                    </Button>
                  </Link>
                  <Link to="/Notary/Notarized-Documents">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Notarized Documents
                    </Button>
                  </Link>
                  {/* <Link to="/Notary/preview">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Start Video Call
                    </Button>
                  </Link> */}
                </Stack>
              </Item>
            </AppBar>
          </Grid>
          <Grid xs={6} md={9.5}>
            <Item sx={UserStyles.gridItem}>
              <Switch>
                <Route
                  exact
                  path="/Notary/Availability"
                  component={AvailabilityForm}
                />

                <Route
                  exact
                  path="/Notary/Notarized-Documents"
                  component={NoatrizedDocuments}
                />
                <Route
                  exact
                  path="/Notary/Upcoming-Appointments"
                  component={UpcomingAppointmnets}
                />
                <Route
                  exact
                  path="/Notary/Unconfirm-Appointments"
                  component={UnconfirmAppointments}
                />
                <Route exact path="/Notary/preview/:id" component={preview} />
                <Route exact path="/notarize/:docid" component={EditPdfView} />
                <Route exact path="/Notary" component={Profile} />
                <Route exact path="*" component={Missing} />
              </Switch>
            </Item>
          </Grid>
        </Grid>
      </Router>
    </Box>
  );
};
export default Notary;
