import { ParameterizedContext } from 'koa';
import { createRequireAuthentication } from '../../src/http/require-authentication';

describe('require-authentication', () => {
  describe('createRequireAuthentication', () => {
    it('adds targetFragmentId to the successRedirect', async () => {
      const requireAuthentication = createRequireAuthentication();
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

      await requireAuthentication(context, async () => {});

      expect(context.session.successRedirect).toBe('/foo#bar');
    });
  });
});
