import { assert, lorem, property } from 'fast-check';
import templatePage from '../../src/templates/page';

describe('page template', (): void => {
  it('returns an HTML5 page', async (): Promise<void> => {
    const page = templatePage('page body');

    expect(page).toStrictEqual(expect.stringMatching(/^<!doctype html>/i));
  });

  it('includes the body content', async (): Promise<void> => {
    assert(property(lorem(), (body: string) => {
      const page = templatePage(body);

      expect(page).toStrictEqual(expect.stringContaining(body));
    }));
  });
});
