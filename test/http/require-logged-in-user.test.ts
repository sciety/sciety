import * as O from 'fp-ts/Option';
import { ParameterizedContext } from 'koa';
import { requireLoggedInUser } from '../../src/http/require-logged-in-user';
import { arbitraryUserDetails } from '../types/user-details.helper';
import { Ports as GetLoggedInScietyUserPorts } from '../../src/http/authentication-and-logging-in-of-sciety-users';

describe('require-logged-in-user', () => {
  it('adds targetFragmentId to the successRedirect', async () => {
    const context = ({
      state: {
        targetFragmentId: 'bar',
      },
      request: {
        headers: {
          referer: '/foo',
        },
      },
      session: {},
      redirect: () => {},
    } as unknown) as ParameterizedContext;
    const adapters: GetLoggedInScietyUserPorts = {
      getUser: () => O.some(arbitraryUserDetails()),
    };

    await requireLoggedInUser(adapters)(context, async () => {});

    expect(context.session.successRedirect).toBe('/foo#bar');
  });
});
