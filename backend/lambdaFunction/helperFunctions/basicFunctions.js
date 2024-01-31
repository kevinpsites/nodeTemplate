class BasicFunctions {
  constructor() {}

  generateRandom12ID = () => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };

  roundToXSpots = (numberToRound, digits) =>
    parseFloat(numberToRound.toFixed(digits));
}

module.exports.BasicFunctions = BasicFunctions;
