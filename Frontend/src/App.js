import "./App.css";
import User from "./components/clientFiles/User";
import Home from "./components/home/Home";
import LoginClient from "./components/login/user/LoginClient";
import SignupClient from "./components/signup/user/SignupClient";
import ResetPasswordPage from "./components/clientFiles/MainFiles/ResetPasswordPage";
import { Route, Switch } from "react-router-dom";
import { Box } from "@mui/system";

function App() {
  return (
    <Box className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/User" component={User} />
        <Route path="/LoginClient" component={LoginClient} />
        <Route path="/SignupClient" component={SignupClient} />
        <Route path="/reset-password" component={ResetPasswordPage} />
      </Switch>
    </Box>
  );
}

export default App;
