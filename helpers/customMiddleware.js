const { v4: uuidV4 } = require("uuid");

/**
 * Function to assign request id and start time.
 *
 * @returns {function(...[*]=)}
 */
module.exports = function () {
  return function (req, res, next) {
    req.id = uuidV4();
    req.startTime = process.hrtime();
    next();
  };
};
