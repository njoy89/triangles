import { Map } from 'immutable';
import { handleActions } from 'redux-actions';

const DEFAULT_STATE = Map({
    name: '',
    loading: false
});

export default handleActions({
    UPDATE_USER_NAME: (state, action) => state.set('name', action.payload),
    REGISTER_USER_REQUEST: state => state.set('loading', true)
}, DEFAULT_STATE);
