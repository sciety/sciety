const { openBrowser, goto, click, closeBrowser, into, textBox, write } = require('taiko');
(async () => {
    try {
        await openBrowser();
        await goto('localhost:8080');
        await click('Log in');
        await write('admin', into(textBox('Username')));
        await write('password', into(textBox('Password')));
        await click('Sign in');
        await click('Return');
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
