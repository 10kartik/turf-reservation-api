// eslint-disable-next-line max-classes-per-file
const sanitizeHtml = require("sanitize-html");

class SanitizeRecursively {
  /**
   * Recursively sanitize.
   *
   * @param {object} params
   *
   * @returns {*}
   * @private
   */
  _sanitizeParamsRecursively(params) {
    const oThis = this;

    if (typeof params === "string") {
      params = oThis._sanitizeString(params);
    } else if (
      typeof params === "boolean" ||
      typeof params === "number" ||
      params === null
    ) {
      // Do nothing and return param as is.
    } else if (params instanceof Array) {
      for (const index in params) {
        params[index] = oThis._sanitizeParamsRecursively(params[index]);
      }
    } else if (params instanceof Object) {
      Object.keys(params).forEach(function (key) {
        params[key] = oThis._sanitizeParamsRecursively(params[key]);
      });
      // eslint-disable-next-line no-negated-condition
    } else if (!params) {
      params = oThis._sanitizeString(params);
    } else {
      // eslint-disable-next-line no-console
      console.error("Invalid params type: ", typeof params);
      params = "";
    }

    return params;
  }

  /**
   * Sanitize string
   *
   * @param str
   *
   * @private
   */
  _sanitizeString(str) {
    const sanitizedHtmlStr = sanitizeHtml(str, { allowedTags: [] });

    return sanitizedHtmlStr.replace(/javascript:/g, "");
  }
}

const sanitizeRecursively = new SanitizeRecursively();

class Sanitizer {
  /**
   * Sanitize Request body and request query params
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {*}
   */
  sanitizeBodyAndQuery(req, res, next) {
    req.body = sanitizeRecursively._sanitizeParamsRecursively(req.body);
    req.query = sanitizeRecursively._sanitizeParamsRecursively(req.query);

    return next();
  }

  /**
   * Sanitize dynamic params in URL
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {*}
   */
  sanitizeDynamicUrlParams(req, res, next) {
    req.params = sanitizeRecursively._sanitizeParamsRecursively(req.params);

    return next();
  }

  /**
   * Sanitize headers
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {*}
   */
  sanitizeHeaderParams(req, res, next) {
    req.sanitizedHeaders = sanitizeRecursively._sanitizeParamsRecursively(
      req.headers
    );
    req.internalDecodedParams.headers = req.sanitizedHeaders;

    return next();
  }

  /**
   * Sanitize object
   *
   * @param {object} params
   *
   * @returns {object}
   */
  sanitizeParams(params) {
    return sanitizeRecursively._sanitizeParamsRecursively(params);
  }
}

module.exports = new Sanitizer();
