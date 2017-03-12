import { combineReducers } from 'redux';

import userName from './userName';
import user from './user';

export default combineReducers({
    user,
    userName
});
