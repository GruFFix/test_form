import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//import views
import MainFrom from 'views/main_form';

export default () =>
  <Router>
    <Switch>
      <Route exact path="/" component={MainFrom} />
    </Switch>
  </Router>;
