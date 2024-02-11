import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//importing browser router from react router dom
import { BrowserRouter as Router ,Route} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Route path="/" component={App} />
    </Router>
  </React.StrictMode>
);
