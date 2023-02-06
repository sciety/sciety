import { Strategy as TwitterStrategy } from 'passport-twitter';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { Ports } from '../../write-side/create-user-account';
import { authenticateWithUserId } from '../authentication-and-logging-in-of-sciety-users';
import { setUpUserIfNecessary } from '../../write-side/create-user-account/set-up-user-if-necessary';
import { createUserAccountCommandCodec } from '../../write-side/commands/create-user-account';

export const twitterPassportStrategy = (ports: Ports) => new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_API_KEY ?? '',
    consumerSecret: process.env.TWITTER_API_SECRET_KEY ?? '',
    callbackURL: `${process.env.APP_ORIGIN ?? ''}/twitter/callback`,
  },
  (_token, _tokenSecret, profile, cb) => {
    // photos can never be undefined:
    // https://github.com/jaredhanson/passport-twitter/blob/cfe7807b0e89e9ff130592c28622e134749e757b/lib/profile.js#L21
    const photos = profile.photos ?? [{ value: '' }];
    const command = pipe(
      {
        userId: profile.id,
        handle: profile.username,
        avatarUrl: photos[0].value,
        displayName: profile.displayName,
      },
      createUserAccountCommandCodec.decode,
    );
    void pipe(
      ports.getAllEvents,
      T.map((events) => pipe(
        command,
        E.map((c) => setUpUserIfNecessary(c)(events)),
      )),
      TE.chainTaskK(ports.commitEvents),
    )()
      .then(() => pipe(
        command,
        E.map((c) => c.userId),
        authenticateWithUserId(cb),
      ));
  },
);
