const validateBody = (schema) => {
  const validator = (req, _, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return next(error);
    }
    next();
  };
  return validator;
};

module.exports = validateBody;
