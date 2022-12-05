import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { EditListDetails } from '../../shared-ports';
import { User } from '../../types/user';
import { UserId } from '../../types/user-id';

type Ports = {
  editListDetails: EditListDetails,
};

type FormBody = {
  name: unknown,
  description: unknown,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleFormSubmission = (adapters: Ports, userId: UserId) => (formBody: FormBody) => TE.left(undefined);

export const editListDetails = (adapters: Ports): Middleware => async (context, next) => {
  const user = context.state.user as User;
  await pipe(
    context.request.body,
    handleFormSubmission(adapters, user.id),
    TE.mapLeft(() => {
      context.redirect('/action-failed');
    }),
    TE.chainTaskK(() => async () => {
      await next();
    }),
  )();
};
