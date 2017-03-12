import { createAction } from 'redux-actions';
import fetch from 'isomorphic-fetch';

const registerUserRequest = createAction('REGISTER_USER_REQUEST');

export default () => {
    return (dispatch, getState) => {
        const userName = getState().userName.get('name').trim();

        if (userName) {
            dispatch(registerUserRequest());

            fetch('/api/registerUser', {
                method: 'post',
                body: JSON.stringify({
                    userName
                })
            }).
            then(response => response.json()).
            then(data => {
                console.log('stasiek', data);
            }).
            catch(() => {
                // TODO
            });
        }
    };
};
