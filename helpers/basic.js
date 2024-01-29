const rootPrefix = "..",
  coreConstants = require(rootPrefix + "/helpers/coreConstants");

/**
 * Class for basic helper methods.
 *
 * @class BasicHelper
 */
class BasicHelper {
  /**
   * Get current timestamp in seconds.
   *
   * @return {number}
   */
  getCurrentTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Convert milliseconds to seconds.
   *
   * @param {number} ms
   * @returns {number}
   */
  convertMsToS(ms) {
    return Math.floor(ms / 1000);
  }

  /**
   * Get current timestamp in milliseconds.
   *
   * @return {number}
   */
  getCurrentTimestampInMilliseconds() {
    return new Date().getTime();
  }

  /**
   * Get current timestamp in minutes.
   *
   * @return {number}
   */
  getCurrentTimestampInMinutes() {
    return Math.floor(new Date().getTime() / (60 * 1000));
  }

  /**
   * Convert date to timestamp in milli-seconds.
   *
   * @param {string} dateStr
   *
   * @return {number} timestamp
   */
  dateToMilliSecondsTimestamp(dateStr) {
    return new Date(dateStr).getTime();
  }

  /**
   * Log date format.
   *
   * @returns {string}
   */
  logDateFormat() {
    const date = new Date();

    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      "." +
      date.getMilliseconds()
    );
  }

  /**
   * Get unique ordered array.
   *
   * @param {array} inputArray
   * @param {number} [limit]
   *
   * @returns {[]}
   */
  uniquate(inputArray, limit) {
    const uniqueMap = {},
      uniqueOrderedArray = [];
    let counter = 0;

    for (let index = 0; index < inputArray.length; index++) {
      const arrayElement = inputArray[index];
      if (!uniqueMap[arrayElement]) {
        counter++;
        uniqueMap[arrayElement] = 1;
        uniqueOrderedArray.push(arrayElement);
        if (counter === limit) {
          return uniqueOrderedArray;
        }
      }
    }

    return uniqueOrderedArray;
  }

  /**
   * Checks whether the object is empty or not.
   *
   * @param {object} obj
   *
   * @return {boolean}
   */
  isEmptyObject(obj) {
    for (const property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if environment is production.
   *
   * @return {boolean}
   */
  isProduction() {
    return coreConstants.environment === "production";
  }

  /**
   * Check if environment is development.
   *
   * @return {boolean}
   */
  isDevelopment() {
    return coreConstants.environment === "development";
  }

  /**
   * Gives unique user name
   *
   * @param name
   * @returns {string}
   */
  getUniqueUserName(name) {
    return (
      name.substring(0, 6) +
      "-" +
      Date.now().toString(36) +
      Math.random().toString(36).substring(2, 4)
    );
  }

  /**
   * Sleep for particular time.
   *
   * @param {number} ms: time in ms
   *
   * @returns {Promise<any>}
   */
  sleep(ms) {
    // eslint-disable-next-line no-console
    console.log(`Sleeping for ${ms} ms.`);

    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Create a duplicate object.
   *
   * @param {object} obj
   * @return {object}
   */
  deepDup(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Compare two objects.
   *
   * @param {object} firstObject
   * @param {object} secondObject
   *
   * @returns {boolean}
   */
  compareObjects(firstObject, secondObject) {
    const oThis = this;

    const firstObjectCopy = oThis.deepDup(firstObject);
    const secondObjectCopy = oThis.deepDup(secondObject);

    for (const key in firstObjectCopy) {
      if (firstObjectCopy[key] != secondObjectCopy[key]) {
        return false;
      }
      delete secondObjectCopy[key];
    }
    for (const key in secondObjectCopy) {
      if (secondObjectCopy[key] != firstObjectCopy[key]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Invert JSON.
   *
   * @param {object} obj
   *
   * @returns {object}
   */
  invert(obj) {
    const ret = {};

    for (const key in obj) {
      ret[obj[key]] = key;
    }

    return ret;
  }

  /**
   * Compare two arrays.
   *
   * @param {array} firstArray
   * @param {array} secondArray
   *
   * @returns {boolean}
   */
  compareArrays(firstArray, secondArray) {
    if (firstArray.length !== secondArray.length) {
      return false;
    }

    const lookupObject = {};

    for (let index = 0; index < firstArray.length; index++) {
      const ele = firstArray[index];

      lookupObject[ele] = lookupObject[ele] || 0;
      lookupObject[ele] += 1;
    }

    for (let index = 0; index < secondArray.length; index++) {
      const ele = secondArray[index];

      if (!lookupObject[ele] || lookupObject[ele] == 0) {
        return false;
      }

      lookupObject[ele] -= 1;
    }

    return true;
  }
}

module.exports = new BasicHelper();
