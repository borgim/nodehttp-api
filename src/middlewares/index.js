import { base } from "./base.js"
import { body } from "./body.js"

export const middlewares = async (req, res) => {
  base(req, res)
  await body(req, res)
}
