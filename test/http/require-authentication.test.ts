import * as O from 'fp-ts/Option';
import { ParameterizedContext } from 'koa';
import { requireAuthentication } from '../../src/http/require-authentication';
import { arbitraryUserDetails } from '../types/user-details.helper';
import { Ports as GetLoggedInScietyUserPorts } from '../../src/http/get-logged-in-sciety-user';

describe('require-authentication', () => {
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

    await requireAuthentication(adapters)(context, async () => {});

    expect(context.session.successRedirect).toBe('/foo#bar');
  });
});
