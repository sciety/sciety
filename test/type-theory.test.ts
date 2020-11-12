describe('type theory', () => {
  describe('built-in types', () => {
    it('has all the javascript one', () => {
      const a: number = 42;
      const b: string = 'forty-two';
      const c: bigint = BigInt('424242424242424242424242424242');
      const d: boolean = true;
      const e: symbol = Symbol('my-iterator');
      const f: null = null;
      const g: undefined = undefined;
      const h: object = {};
      expect([a, b, c, d, e, f, g, h]).toHaveLength(8);
    });

    it('prefers Record instead of object', () => {
      const record: Record<string, number> = {};
      record['answer'] = 42;
      expect(record.answer).toStrictEqual(42);
    });

    it('uses unknown as the top type', () => {
      const acceptsEverything = (_input: unknown) => 42;
      acceptsEverything('some-input');
    });

    it('uses never as the bottom type', () => {
      const infiniteLoop = (): never => { while (true) { console.log('one more iteration'); } };
    });

    describe('provides unit types', () => {
      const canOnlyHaveOneValue = 'foobar';
      it('allows operations', () => {
        expect(canOnlyHaveOneValue.substr(0, 3)).toStrictEqual('foo');
      });
    });
  });

  describe('data structures', () => {
    it('provides Arrays', () => {
      const array: Array<string> = ['a', 'b'];
      expect(array).toHaveLength(2);
    });

    it('provides (im)mutable tuples', () => {
      const tuple: readonly [string, string] = ['a', 'b'];
      expect(tuple).toHaveLength(2);
      // doesn't compile:
      //tuple.push('c'); 
      //tuple.pop();
    });

    it('provides const enums which are ordered', () => {
      const enum Direction {
        Up,
        Down,
      }
      expect(Direction.Up).toStrictEqual(0);
      expect(Direction.Down).toStrictEqual(1);
      expect(Direction.Up < Direction.Down).toBe(true);
    });

    it('provides interfaces that can be merged', () => {
      // can only represent objects, not other primitive types
      interface A {
        first: number;
      }

      interface A {
        second: number;
      }

      const a: A = {first: 1, second: 2};
      expect(a.first).toStrictEqual(1);
    });

    it('provides type aliases for what interfaces do', () => {
      type A = {
        first: number;
      }

      type B = {
        second: number;
      }

      const a: A & B = {first: 1, second: 2};
      expect(a.first).toStrictEqual(1);
    });
  });

  describe('higher-order types', () => {
    it('provides non-discriminated unions', () => {
      const numberOrString: number|string = 42;
      switch (true) {
        // switch with typeof, or existing properties or tags you put in yourself (e.g. `.type` === ...)
        case typeof numberOrString === 'number':
          expect(numberOrString).toStrictEqual(42);
          break;
        case typeof numberOrString === 'string':
          expect(numberOrString).toStrictEqual('forty-two');
          break;
      }
    })

    it('provides intersection types', () => {
      type Combined = { a: number } & { b: string };
      const combined: Combined = {'a': 42, b: 'forty-two'};
      expect(combined.a).toStrictEqual(42);
    });
  });

  describe('provides type aliases', () => {
    it('for domain-specific names', () => {
      type Size = [number, number];
      let x: Size = [101, 999];
      expect(x[0]).toStrictEqual(101);
    });

    describe('can use tagged intersections to restrict a new type without runtime overhead', () => {
      type UserId = string & { readonly __compileTimeOnly: unique symbol };
      const userId: UserId = 'my-user-id' as UserId;
      expect(userId.length).toStrictEqual(10);
    });

    describe('can use classes to box values and avoid operations on them', () => {
      class UserId {
        constructor(private value: string) {}
        // other methods...
      }
      const userId = new UserId('my-user-id');
      // will not mutate anyway, but doesn't compile because ids are opaque
      // expect(userId.replace('my-', 'foo-')).toStrictEqual('foo-user-id');
    });
  });

  describe('polymorphism', () => {
    it('provides generic types on functions', () => {
      const id = <T>(a: T) => a;
      expect(id(42)).toStrictEqual(42);
    });

    it('provides constraints on generic types', () => {
      const id = <T extends { 'answer': unknown }>(a: T) => a;
      expect(id({ answer: 42 }).answer).toStrictEqual(42);
    });

    it('provides generic types on classes', () => {
      class Tag<T> {
        constructor(private value: T, private tag: string) {}
        toString() {return `${this.tag}:${this.value.toString()}`; }
      } 
      expect((new Tag(42, 'answer')).toString()).toStrictEqual('answer:42');
    });
  })
});
