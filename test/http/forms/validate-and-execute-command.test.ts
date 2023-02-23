describe('validate-and-execute-command', () => {
  describe('both user inputs are safe and valid', () => {
    it.todo('raises the necessary events');
  });

  describe('when one or more fields are missing from the form', () => {
    it.todo('return to an empty form');
  });

  describe.each([
    ['Valid Full Name', '<unsafe>handle', 'full name shown, handle blank'],
    ['Valid Full Name', 'invalidhandletoolong', 'full name shown, handle shown'],
    ['<unsafe> Full Name', 'validhandle', 'full name blank, handle shown'],
    ['<unsafe> Full Name', '<unsafe>handle', 'full name blank, handle blank'],
    ['<unsafe> Full Name', 'invalidhandletoolong', 'full name blank, handle shown'],
    ['Invalid Full Name Due to being too looooong', 'validhandle', 'full name shown, handle shown'],
    ['Invalid Full Name Due to being too looooong', '<unsafe>handle', 'full name shown, handle blank'],
    ['Invalid Full Name Due to being too looooong', 'invalidhandletoolong', 'full name shown, handle shown'],
  ])('given %s and %s', (fullName, handle, outcome) => {
    it.todo(`${outcome}`);
  });

  describe('when there is no authenticated user', () => {
    it.todo('return an oops page');
  });

  describe('when the user handle already exists', () => {
    it.todo('return a pertinent error summary');

    it.todo('return a form populated with user input');
  });
});
