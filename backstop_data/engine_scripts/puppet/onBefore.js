module.exports = async (page, scenario, vp) => {
  console.log('onBefore');
  if (scenario.isUserLoggedIn) {
    console.log("Logging in user");
    const koaSessionCookie = {
      url: "http://sciety_app",
      name: "koa.sess",
      // {
      //   "passport": {
      //     "user": {
      //       "id": "1338873008283377664",
      //       "handle": "account27775998"
      //     }
      //   },
      //   "editorialCommunityId": "5142a5bc-6b18-42b1-9a8d-7342d7d17e94", // leftover, delete
      //   "_expire": 1662633895227,
      //   "_maxAge": 31536000000
      // }
      value: "eyJwYXNzcG9ydCI6eyJ1c2VyIjp7ImlkIjoiMTMzODg3MzAwODI4MzM3NzY2NCIsImhhbmRsZSI6ImFjY291bnQyNzc3NTk5OCJ9fSwiZWRpdG9yaWFsQ29tbXVuaXR5SWQiOiI1MTQyYTViYy02YjE4LTQyYjEtOWE4ZC03MzQyZDdkMTdlOTQiLCJfZXhwaXJlIjoxNjYyNjMzODk1MjI3LCJfbWF4QWdlIjozMTUzNjAwMDAwMH0=",
    }
    await page.setCookie(koaSessionCookie);
    const koaSessionSignatureCookie = {
      url: "http://sciety_app",
      name: "koa.sess.sig",
      value: "_dgIC8VIzdRkq3f1PzKzR-bkq7c",
    }
    await page.setCookie(koaSessionSignatureCookie);
  }
};
