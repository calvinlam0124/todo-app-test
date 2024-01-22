import {Hono} from 'hono'
import routes from './routes.ts'

const app = new Hono()

routes(app);


// before end of app
app.onError((err, c) => {
    console.error(`${err}`);
    return c.text('Custom Error Message', 500);
})

app.notFound((c) => {
    return c.text('Custom 404 Message', 404);
})

// app.showRoutes() // @TODO: for local debug only, or move it to any console repl

const port = Number(process.env.PORT) || 3000
console.log(`Running at http://localhost:${port}`)

export default app
