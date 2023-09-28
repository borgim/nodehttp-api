import http from 'node:http'
import { routes } from './routes.js'
import { middlewares } from './middlewares/index.js'
import { extractQueryParams } from './utils/extractQueryParams.js'

const server = http.createServer(async (request, response) => {

  const { method, url } = request

  await middlewares(request, response)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {

    const routeParams = url.match(route.path)

    console.log(route.method, routeParams.input)

    const { query, ...params } = routeParams.groups

    request.params = params
    request.query = query ? extractQueryParams(query) : {}


    return route.handler(request, response)
  }

  response.statusCode = 404
  response.end()
})

server.listen(3000)
