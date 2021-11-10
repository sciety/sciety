type MatchStarter<TInput> = {
  when: <TPattern extends TInput, TResult>(
    guard: (inputValue: any) => inputValue is TPattern,
    action: (matchedValue: TPattern) => TResult
  ) => Exclude<TInput, TPattern> extends never
    ? BuiltMatch<TResult>
    : MatchBuilder<Exclude<TInput, TPattern>, TResult>,

  whenAnd: <TPattern extends TInput, TResult>(
    guard: (inputValue: any) => inputValue is TPattern,
    predicate: (matchedValue: TPattern) => boolean,
    action: (matchedValue: TPattern) => TResult
  ) => MatchBuilder<TInput, TResult>,
};

type MatchBuilder<TInput, TResult> = {
  when: <TPattern extends TInput>(
    guard: (inputValue: any) => inputValue is TPattern,
    action: (matchedValue: TPattern) => TResult
  ) => Exclude<TInput, TPattern> extends never
    ? BuiltMatch<TResult>
    : MatchBuilder<Exclude<TInput, TPattern>, TResult>,

  whenAnd: <TPattern extends TInput>(
    guard: (inputValue: any) => inputValue is TPattern,
    predicate: (matchedValue: TPattern) => boolean,
    action: (matchedValue: TPattern) => TResult
  ) => MatchBuilder<TInput, TResult>,

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
    this.cases.push([guard, () => true, action]);
    return this;
  }

  whenAnd(guard, predicate, action) {
    this.cases.push([guard, predicate, action]);
    return this;
  }

  otherwise(action) {
    this.cases.push([() => true, () => true, action]);
  }

  run() {
    for (const [guard, predicate, action] of this.cases) {
      if (guard(this.input) && predicate(this.input)) return action(this.input);
    }

    throw new Error('TODO');
  }
}

export const match = <TInput>(inputValue: TInput): MatchStarter<TInput> => new MatchContext(inputValue) as any;
