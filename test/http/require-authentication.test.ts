import { ParameterizedContext } from 'koa';
import { annotateWithTwitterSuccess, requireAuthentication, targetFragmentIdField } from '../../src/http/require-authentication';

describe('require-authentication', () => {
  describe('createRequireAuthentication', () => {
    it('adds targetFragmentId to the successRedirect', async () => {
      const context = ({
        state: {},
        request: {
          headers: {
            referer: '/foo',
          },
          body: {
            [targetFragmentIdField]: 'bar',
          },
        },
        session: {},
        redirect: () => {},
      } as unknown) as ParameterizedContext;

      await requireAuthentication(context, async () => {});

      expect(context.session.successRedirect).toBe('/foo#bar');
    });
  });

  describe('annotateWithTwitterSuccess', () => {
    describe('when there is no pre-existing query parameter', () => {
      it('adds the twitter login parameter', () => {
        const result = annotateWithTwitterSuccess('/foo');

        expect(result).toStrictEqual('/foo?login_success=twitter');
      });
    });

    describe('when there is a pre-existing query parameter', () => {
      it('adds the twitter login parameter', () => {
        const result = annotateWithTwitterSuccess('/foo?q=37');

        expect(result).toStrictEqual('/foo?q=37&login_success=twitter');
      });
    });

    describe('when there is a pre-existing login_success query parameter', () => {
      it('adds the twitter login parameter only once', () => {
        const result = annotateWithTwitterSuccess('/foo?q=37&login_success=twitter');

        expect(result).toStrictEqual('/foo?q=37&login_success=twitter');
      });
    });
  });
});
