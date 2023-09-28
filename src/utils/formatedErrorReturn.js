export function formatedErrorReturn(req, res, statusCode, error) {
  const errorReturn = {
    message: error.message
  }

  res.statusCode = statusCode

  return JSON.stringify(errorReturn)
}
