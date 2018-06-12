const Validator = require("Validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfile(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.title = !isEmpty(data.title) ? data.title : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title is required";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
