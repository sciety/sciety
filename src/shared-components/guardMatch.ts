type MatchStarter<TInput> = {
  when: <TPattern extends TInput, TResult>(
    guard: (inputValue: any) => inputValue is TPattern,
    action: (matchedValue: TPattern) => TResult
  ) => Exclude<TInput, TPattern> extends never
    ? BuiltMatch<TResult>
    : MatchBuilder<Exclude<TInput, TPattern>, TResult>,
};

type MatchBuilder<TInput, TResult> = {
  when: <TPattern extends TInput>(
    guard: (inputValue: any) => inputValue is TPattern,
    action: (matchedValue: TPattern) => TResult
  ) => Exclude<TInput, TPattern> extends never
    ? BuiltMatch<TResult>
    : MatchBuilder<Exclude<TInput, TPattern>, TResult>,

  otherwise: (action: (v: TInput) => TResult) => BuiltMatch<TResult>,
};

export type BuiltMatch<TResult> = {
  run: () => TResult,
};

class MatchContext {
  cases;

  input;

  constructor(input) {
    this.cases = [];
    this.input = input;
  }

  when(guard, action) {
    this.cases.push([guard, action]);
    return this;
  }

  otherwise(action) {
    this.cases.push([() => true, action]);
  }

  run() {
    for (const [guard, action] of this.cases) {
      if (guard(this.input)) return action(this.input);
    }

    throw new Error('TODO');
  }
}

export const match = <TInput>(inputValue: TInput): MatchStarter<TInput> => new MatchContext(inputValue) as any;
