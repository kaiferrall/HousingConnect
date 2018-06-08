const Validator = require("Validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfile(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.program = !isEmpty(data.program) ? data.program : "";
  data.year = !isEmpty(data.year) ? data.year : "";
  data.bio = !isEmpty(data.bio) ? data.bio : "";

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Handle is required";
  }

  if (Validator.isEmpty(data.program)) {
    errors.program = "Program is required";
  }

  if (Validator.isEmpty(data.year)) {
    errors.year = "Year is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
