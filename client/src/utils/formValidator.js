function validateData(schema, data) {
  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    const errorObject = {};
    validationResult.error.issues.forEach(issue => {
      errorObject[issue.path[0]] = issue.message;
    });
    return errorObject;
  }
  return null;
}

export default validateData;
