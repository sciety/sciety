import { DOMParser } from '@xmldom/xmldom';
import { containsUnrecoverableError } from '../../../src/third-parties/crossref/contains-unrecoverable-error';
import { arbitraryString } from '../../helpers';

describe('contains-unrecoverable-error', () => {
  const parser = new DOMParser({
    errorHandler: (_, msg) => {
      throw msg;
    },
  });

  describe('when the document', () => {
    describe('does not contain a <crossref> tag', () => {
      const input = '<?xml version="1.0" encoding="UTF-8"?>\n<doi_records>\r\n  <doi_record>\r\n      </doi_record>\r\n</doi_records>';
      const result = containsUnrecoverableError(parser.parseFromString(input, 'text/xml'));

      it('detects an unrecoverable error', () => {
        expect(result).toBe(true);
      });
    });

    describe('contains a <crossref> tag with its only child an <error> tag', () => {
      const input = '<?xml version="1.0" encoding="UTF-8"?>\n<doi_records>\r\n  <doi_record>\r\n    <crossref>\r\n      <error>doi:10.21203/rs.3.rs-3869684/v1</error>\r\n    </crossref>\r\n  </doi_record>\r\n</doi_records>';
      const result = containsUnrecoverableError(parser.parseFromString(input, 'text/xml'));

      it('detects an unrecoverable error', () => {
        expect(result).toBe(true);
      });
    });

    describe('contains an ordinary crossref record', () => {
      const input = `
        <?xml version="1.0" encoding="UTF-8"?>
        <doi_records>
          <doi_record>
            <crossref>
              <posted_content>
                <titles>
                  <title>${arbitraryString()}</title>
                </titles>
              </posted_content>
            </crossref>
          </doi_record>
        </doi_records>
      `;
      const result = containsUnrecoverableError(parser.parseFromString(input, 'text/xml'));

      it('does not detect an unrecoverable error', () => {
        expect(result).toBe(false);
      });
    });
  });
});
