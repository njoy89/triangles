import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import mainReducer from './reducers/mainReducer';

const loggerMiddleware = createLogger();

export default createStore(
    mainReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
