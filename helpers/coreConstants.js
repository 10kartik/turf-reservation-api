/* eslint-disable no-process-env */

/**
 * Class for core constants.
 *
 * @class CoreConstants
 */
class CoreConstants {
  get environment() {
    return process.env.ENVIRONMENT;
  }

  get dbSuffix() {
    return process.env.DB_SUFFIX;
  }

  get environmentShort() {
    return process.env.ENVIRONMENT.substring(0, 2);
  }

  get APP_NAME() {
    return process.env.APP_NAME;
  }

  get API_DOMAIN() {
    return process.env.API_DOMAIN;
  }

  get PORT() {
    return process.env.PORT;
  }
}

module.exports = new CoreConstants();
