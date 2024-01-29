const rootPrefix = "../../..",
  basicHelper = require(rootPrefix + "/helpers/basic");

let invertedStatuses;

/**
 * Class for booking constants.
 * @class BookingConstants
 */
class BookingConstants {
  /**
   * Get string value for cancelled status.
   * @returns {string}
   */
  get cancelledStatus() {
    return "CANCELLED";
  }

  /**
   * Get string value for confirmed status.
   * @returns {string}
   */
  get confirmedStatus() {
    return "CONFIRMED";
  }

  /**
   * Get string value for pending status.
   * @returns {string}
   */
  get pendingStatus() {
    return "PENDING";
  }

  /**
   * Get enum for status.
   * @returns {object}
   */
  get statuses() {
    const oThis = this;

    return {
      1: oThis.pendingStatus,
      2: oThis.confirmedStatus,
      3: oThis.cancelledStatus,
    };
  }

  /**
   * Get enum value from startup status string.
   * @returns {object}
   */
  get invertedStatuses() {
    const oThis = this;

    invertedStatuses = invertedStatuses || basicHelper.invert(oThis.statuses);

    return invertedStatuses;
  }
}

module.exports = new BookingConstants();
