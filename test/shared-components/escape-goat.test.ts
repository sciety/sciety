import { htmlEscape } from 'escape-goat';

describe('escape-goat', () => {
  it('escapes all quotes and HTML tags', async () => {
    const sample = '<p class="abstract">Someone\'s abstract: "lorem ipsum"</p>';

    expect(htmlEscape(sample)).toBe(
      '&lt;p class=&quot;abstract&quot;&gt;Someone&#39;s abstract: &quot;lorem ipsum&quot;&lt;/p&gt;',
    );
  });
});
