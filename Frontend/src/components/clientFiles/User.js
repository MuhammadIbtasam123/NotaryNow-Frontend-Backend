import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Nav from "./HelperFiles/Nav";
import AppBar from "@mui/material/AppBar";
import Profile from "./MainFiles/Profile";
import UploadDocument from "./MainFiles/UploadDocument";
import CreateAppointment from "./MainFiles/CreateAppointment";
import BookAppointment from "./MainFiles/BookAppointment";
import UnpaidAppointments from "./MainFiles/UnpaidAppointments";
import UnconfirmedAppointments from "./MainFiles/UnconfirmedAppoitnemnt";
import UpcomingAppointmnets from "./MainFiles/UpcomingAppointments";
import NoatrizedDocuments from "./MainFiles/NotarizedDocuments";
import EditPdfView from "./HelperFiles/EditPdfView";
import Preview from "./MainFiles/Preview";
import Missing from "./MainFiles/Missing";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import * as UserStyles from "./userStyle";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const User = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Router>
        <Grid container spacing={6} columnSpacing={2}>
          <Grid xs={12} md={12}>
            <Item>
              <Nav User="Client" />
            </Item>
          </Grid>
          <Grid xs={6} md={2.5}>
            <AppBar sx={UserStyles.NavBar}>
              <Item sx={UserStyles.NavItem}>
                {/* Buttons */}
                <Stack
                  direction="column"
                  spacing={3}
                  sx={{ marginTop: "0.5rem" }}
                >
                  <Link to="/User">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Profile
                    </Button>
                  </Link>
                  <Link to="/User/Upload-Documents">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Upload Document
                    </Button>
                  </Link>
                  <Link to="/User/Create-Appointments">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Create Appointment
                    </Button>
                  </Link>
                  <Link to="/User/Unpaid-Appointments">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Unpaid Appointments
                    </Button>
                  </Link>
                  <Link to="/User/Unconfirmed-Appointments">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Unconfirm Appointment
                    </Button>
                  </Link>
                  <Link to="/User/Upcoming-Appointments">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Upcoming Appointments
                    </Button>
                  </Link>
                  <Link to="/User/Notarized-Documents">
                    <Button
                      sx={{
                        ...UserStyles.buttonStyle,
                        "&:hover": { ...UserStyles.buttonStyleHover },
                      }}
                    >
                      Notarized Documents
                    </Button>
                  </Link>
                </Stack>
              </Item>
            </AppBar>
          </Grid>
          <Grid xs={6} md={9.5}>
            <Item sx={UserStyles.gridItem}>
              <Switch>
                <Route
                  exact
                  path="/User/Upload-Documents"
                  component={UploadDocument}
                />
                <Route
                  exact
                  path="/User/Create-Appointments/Book-Appointments/:id"
                  component={BookAppointment}
                />
                <Route
                  exact
                  path="/User/Create-Appointments"
                  component={CreateAppointment}
                />
                <Route
                  exact
                  path="/User/Unpaid-Appointments"
                  component={UnpaidAppointments}
                />
                <Route
                  exact
                  path="/User/Unconfirmed-Appointments"
                  component={UnconfirmedAppointments}
                />
                <Route
                  exact
                  path="/User/Upcoming-Appointments"
                  component={UpcomingAppointmnets}
                />
                <Route
                  exact
                  path="/User/Notarized-Documents"
                  component={NoatrizedDocuments}
                />
                <Route exact path="/User/preview/:id" component={Preview} />
                <Route
                  exact
                  path="/User/eSignDoc/:docid"
                  component={EditPdfView}
                />
                <Route exact path="/User" component={Profile} />
                <Route path="*" component={Missing} />
              </Switch>
            </Item>
          </Grid>
        </Grid>
      </Router>
    </Box>
  );
};
export default User;
