import { annotateWithTwitterSuccess } from '../../src/http/annotate-with-twitter-success';

describe('annotate-with-twitter-success', () => {
  describe('when there is no pre-existing query parameter', () => {
    it('adds the twitter login parameter', () => {
      const result = annotateWithTwitterSuccess('/foo');

      expect(result).toBe('/foo?login_success=twitter');
    });
  });

  describe('when there is a pre-existing query parameter', () => {
    it('adds the twitter login parameter', () => {
      const result = annotateWithTwitterSuccess('/foo?q=37');

      expect(result).toBe('/foo?q=37&login_success=twitter');
    });
  });

  describe('when there is a pre-existing login_success query parameter', () => {
    it('adds the twitter login parameter only once', () => {
      const result = annotateWithTwitterSuccess('/foo?q=37&login_success=twitter');

      expect(result).toBe('/foo?q=37&login_success=twitter');
    });
  });
});
