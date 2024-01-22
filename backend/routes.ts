import {Hono} from 'hono'
import { cors } from 'hono/cors'
import {list, read, create, update, del} from './actions';

export default async function (app: Hono) {
    // cross-origin resource sharing
    app.use('/*', cors({
        origin: [
            'http://localhost',
            'http://localhost:4000',
            'http://localhost:8080',
        ],
    }))

    // healthcheck
    app.get('/health', (c) => c.text('ok'));

    // List
    app.get('/', async (c) => {
        return c.json(await list());
    });

    // Create
    // curl -X POST -d name=1234 localhost:3000/
    app.post('/', async (c) => {
        const body = await c.req.parseBody();
        await create('' + body.name);
        return c.json(await list());
    });

    // Read
    // curl  localhost:3000/087f5ae9-ff7c-4a7e-be51-65471a5004ef
    app.get('/:id', async (c) => {
        const id = c.req.param('id');
        const data = await read(id);
        return c.json(data);
    });

    // Update
    // curl -X PUT -d name=1234 localhost:3000/087f5ae9-ff7c-4a7e-be51-65471a5004ef
    // curl -X PATCH -d name=123456 localhost:3000/087f5ae9-ff7c-4a7e-be51-65471a5004ef
    app.on(['PUT', 'PATCH'], '/:id', async (c) => {
        const id = c.req.param('id');
        const body = await c.req.parseBody();
        await update(id, ''+body.name);
        return c.json(await list());
    });

    // Delete
    // curl -X DELETE localhost:3000/087f5ae9-ff7c-4a7e-be51-65471a5004ef
    app.delete('/:id', async (c) => {
        const id = c.req.param('id');
        await del(id);
        return c.json(await list());
    });

    app.showRoutes()
}
