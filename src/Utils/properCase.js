const changeLetterFormat = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

module.exports = changeLetterFormat;
