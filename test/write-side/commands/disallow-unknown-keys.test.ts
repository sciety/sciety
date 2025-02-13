describe('disallow-unknown-keys', () => {
  describe('given an input object with unspecified keys and a type codec', () => {
    describe('using the type codec', () => {
      it.todo('decodes successfully');

      it.todo('allows unspecified keys to be accessed at runtime');
    });

    describe('wrapping the codec with `exact`', () => {
      it.todo('decodes successfully');

      it.todo('makes unspecified keys inaccessible at runtime');
    });

    describe('using an equivalent `strict` codec', () => {
      it.todo('decodes successfully');

      it.todo('makes unspecified keys inaccessible at runtime');
    });

    describe('wrapping the codec with `disallow`', () => {
      it.todo('fails to decode');
    });
  });
});
