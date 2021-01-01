import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '../styles/App.css';
import Login from './Login';
import Dashboard from './Dashboard';
import NewTimekeeper from './NewTimekeeper';
import Timekeeper from './Timekeeper';
import NotFound from './NotFound';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/new" component={NewTimekeeper} />
        <Route path="/timekeeper/:id" component={Timekeeper} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
