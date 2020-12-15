const { openBrowser, goto, closeBrowser } = require('taiko');
(async () => {
    try {
        await openBrowser();
        await goto('localhost:8080');
    } catch (error) {
        console.error(error);
    } finally {
        await closeBrowser();
    }
})();
