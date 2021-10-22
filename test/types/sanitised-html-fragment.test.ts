import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('sanitise', () => {
  it('cleans up mismatched HTML tags', () => {
    const dirtyInput = toHtmlFragment('<strong><em>bold italic</strong> italic</em>');
    const sanitised = sanitise(dirtyInput);

    expect(sanitised).toBe('<strong><em>bold italic</em></strong> italic');
  });

  it('removes <script> tags', () => {
    const dirtyInput = toHtmlFragment('cleaned <script>var bad = true;</script> html');
    const sanitised = sanitise(dirtyInput);

    expect(sanitised).toBe('cleaned  html');
  });
});
