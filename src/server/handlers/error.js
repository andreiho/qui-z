/*
 * Catch Errors Handler
 *
 * With async/await, you need some way to catch errors
 * Instead of using try{} catch(e) {} in each controller, we wrap the function in
 * catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
 */
exports.catchErrors = (fn) => {
  return (req, res, next) => {
    return fn(req, res, next).catch(next);
  };
};

/*
 * Development Error Handler
 *
 * In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  err.status = err.isJoi ? 400 : err.status;

  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };

  if (process.env.NODE_ENV === 'development' || process.argv.indexOf('--log') !== -1) {
    console.error(err);
  }

  res.status(err.status || 500);
  res.format({
    'application/json': () => res.json(errorDetails)
  });
};

/*
 * Production Error Handler
 *
 * No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  err.status = err.isJoi ? 400 : err.status;

  res.status(err.status || 500);
  res.format({
    'application/json': () => res.json({
      message: err.message
    })
  });
};
