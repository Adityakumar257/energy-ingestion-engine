function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: "Validation error",
        details: parsed.error.flatten()
      });
    }
    req.validatedBody = parsed.data;
    next();
  };
}

module.exports = { validate };
