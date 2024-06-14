import "./App.css";
import Home from "./components/home/Home";
import LoginNotary from "./components/login/LoginNotary";
import SignupNotary from "./components/signup/SignupNotary";
import Notary from "./components/NotaryFiles/Notary";
import NotaryReset from "./components/NotaryFiles/MainFiles/NotaryReset";
import genratePivateKey from "./components/signup/generatePrivateKey.jsx";
import { Route, Switch } from "react-router-dom";
import { Box } from "@mui/system";

function App() {
  return (
    <Box className="App">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/Notary" component={Notary} />
        <Route path="/LoginNotary" component={LoginNotary} />
        <Route path="/SignupNotary" component={SignupNotary} />
        <Route path="/generateCertificate" component={genratePivateKey} />
        <Route path="/reset-password-notary" component={NotaryReset} />
      </Switch>
    </Box>
  );
}

export default App;
