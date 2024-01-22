import {describe, expect, test} from '@jest/globals';
import app from './index'


let testId = 'eafd8ee4-e31a-4629-bc62-43ce636372e3';
const testName = 'test-test-test';
const updatedTestName = 'updated-test-test';

describe('Test routes', () => {
    test('route exists', async () => {
        const routes = app.routes;
        // health check
        expect(routes[1].path).toEqual( '/health')
        expect(routes[1].method).toEqual( 'GET')
        // list
        expect(routes[2].path).toEqual( '/')
        expect(routes[2].method).toEqual( 'GET')
        // create
        expect(routes[3].path).toEqual( '/')
        expect(routes[3].method).toEqual( 'POST')
        // read
        expect(routes[4].path).toEqual( '/:id')
        expect(routes[4].method).toEqual( 'GET')
        // update - put
        expect(routes[5].path).toEqual( '/:id')
        expect(routes[5].method).toEqual( 'PUT')
        // update - patch
        expect(routes[6].path).toEqual( '/:id')
        expect(routes[6].method).toEqual( 'PATCH')
        // delete
        expect(routes[7].path).toEqual( '/:id')
        expect(routes[7].method).toEqual( 'DELETE')
    })

    test('GET /health', async () => {
        const res = await app.request('/health')
        expect(res.status).toBe(200)
        expect(await res.text()).toBe('ok')
    })

    test('create todo', async () => {
        const formData = new FormData();
        formData.append('name', testName);
        const res = await app.request('/', {
            method: 'POST',
            body: formData
        })
        const json = await res.json();
        testId = json[0].id;

        expect(res.status).toBe(200)
    })

    test('read todo', async () => {
        const res = await app.request(`/${testId}`)
        expect(res.status).toBe(200)
    })


    test('update todo - put method', async () => {
        const formData = new FormData();
        formData.append('name', updatedTestName);
        const res = await app.request(`/${testId}`, {
            method: 'PUT',
            body: formData
        })

        expect(res.status).toBe(200)
    })

    test('delete todo', async () => {
        const res = await app.request(`/${testId}`, {
            method: 'DELETE'
        })

        expect(res.status).toBe(200)
    })
})

