import { toHtmlFragment } from '../../src/types/html-fragment';
import { sanitise } from '../../src/types/sanitised-html-fragment';

describe('sanitise', () => {
  it('cleans up mismatched HTML tags', () => {
    const dirtyInput = toHtmlFragment('<strong><em>bold italic</strong> italic</em>');
    const sanitised = sanitise(dirtyInput);

    expect(sanitised).toStrictEqual('<strong><em>bold italic</em></strong> italic');
  });

  it('removes <script> tags', () => {
    const dirtyInput = toHtmlFragment('cleaned <script>var bad = true;</script> html');
    const sanitised = sanitise(dirtyInput);

    expect(sanitised).toStrictEqual('cleaned  html');
  });

  it('blah', () => {
    const dirtyInput = toHtmlFragment('<ol start="1"><li>1</li></ol><ol start="2"><li>2</li></ol>');
    const sanitised = sanitise(dirtyInput);

    expect(sanitised).toStrictEqual('cleaned  html');
  });
});
