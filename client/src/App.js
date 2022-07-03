import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { isLoggedIn, logout } from './auth';
import { CompanyDetail } from './CompanyDetail';
import { LoginForm } from './LoginForm';
import { JobBoard } from './JobBoard';
import { JobDetail } from './JobDetail';
import { JobForm } from './JobForm';
import { NavBar } from './NavBar';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedIn: isLoggedIn() };
  }

  handleLogin() {
    this.setState({ loggedIn: true });
    this.router.history.push('/');
  }

  handleLogout() {
    logout();
    this.setState({ loggedIn: false });
    this.router.history.push('/');
  }

  render() {
    const { loggedIn } = this.state;
    let appRoutes = (
      <Switch>
        <Route exact path="/" component={JobBoard} />
        <Route path="/companies/:companyId" component={CompanyDetail} />
        <Route path="/jobs/:jobId" component={JobDetail} />
        <Route
          exact
          path="/login"
          render={() => <LoginForm onLogin={this.handleLogin.bind(this)} />}
        />
        <Redirect to="/" />
      </Switch>
    );
    if (loggedIn) {
      appRoutes = (
        <Switch>
          <Route exact path="/" component={JobBoard} />
          <Route path="/companies/:companyId" component={CompanyDetail} />
          <Route exact path="/job/new" component={JobForm} />
          <Route path="/jobs/:jobId" component={JobDetail} />
          <Redirect from="*" to="/" />
        </Switch>
      );
    }
    return (
      <Router ref={(router) => (this.router = router)}>
        <div>
          <NavBar loggedIn={loggedIn} onLogout={this.handleLogout.bind(this)} />
          <section className="section">
            <div className="container">{appRoutes}</div>
          </section>
        </div>
      </Router>
    );
  }
}
