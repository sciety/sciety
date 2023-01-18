import { Strategy as LocalStrategy } from 'passport-local';
import { toUserId } from '../../types/user-id';
import { createAccountIfNecessary, Ports } from '../../user-account/create-account-if-necessary';
import { writeUserToState } from '../get-logged-in-sciety-user';

export const setupLocalStrategy = (ports: Ports) => new LocalStrategy(
  (username, _password, cb) => {
    const user = {
      id: toUserId(username),
      handle: 'account27775998',
      avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
      displayName: '',
    };
    void createAccountIfNecessary(ports)(user)()
      .then(() => writeUserToState(cb)(user));
  },
);
