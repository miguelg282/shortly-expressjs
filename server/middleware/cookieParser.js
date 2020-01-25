const parseCookies = (req, res, next) => {
  var newCookie = {};
  if (req.headers.cookie) {
    var cookies = req.headers.cookie.split("; ");
    cookies.forEach(cookie => {
      var cookieMonster = cookie.split("=");
      newCookie[cookieMonster[0]] = cookieMonster[1];
    });

  }
  req.cookies = newCookie;
  next();

};

module.exports = parseCookies;

//key value pair.
// In middleware/cookieParser.js, write a middleware function that will access the cookies on an incoming request, parse them into an object, and assign this object to a cookies property on the request.