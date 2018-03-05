import "babel-polyfill";

import React from 'react';
import ReactDOM from 'react-dom';

// stylesheets
import "../stylesheets/index.scss";

//import route
import AppRoutes from 'routes';

ReactDOM.render(
  <AppRoutes />,
  document.getElementById('app-container'),
);