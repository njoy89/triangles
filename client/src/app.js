import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import store from './store';

import App from './components/App';

const rootElement = document.getElementById('root');

render(
    <Provider store={store}>
        <Router history={ browserHistory }>
            <Route path='/' component={ App } />
        </Router>
    </Provider>,
    rootElement
);
