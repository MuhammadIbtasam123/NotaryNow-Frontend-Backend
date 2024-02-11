import './App.css';
import User from './components/clientFiles/User';
import Home from './components/home/Home';
import LoginClient from './components/login/user/LoginClient';
import LoginNotary from './components/login/user/LoginNotary';
import SignupNotary from './components/signup/user/SignupNotary';
import SignupClient from './components/signup/user/SignupClient';
import { Route, Switch } from 'react-router-dom';
import { Box } from '@mui/system';

function App() {
  return (
    <Box className='App'>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/User' component={User} />
        <Route path='/LoginClient' component={LoginClient}/>
        <Route path='/LoginNotary' component={LoginNotary}/>
        <Route path='/SignupClient' component={SignupClient}/>
        <Route path='/SignupNotary' component={SignupNotary}/>

      </Switch>
    </Box>
  );
}

export default App;
