import db from './database'

const list = async () => {
    const client = await db();
    const sql = 'SELECT * FROM "Duty" ORDER BY "id" ASC';
    const {rows} = await client.query(sql);
    return rows;
}
const read = async (id: string) => {
    const client = await db();
    const sql = 'SELECT * FROM "Duty" WHERE "id" = $1';
    const values = [id]
    const {rows} = await client.query(sql, values);
    return rows;
}

const create = async (name: string) => {
    const client = await db();
    const sql = 'INSERT INTO "Duty" ("name") VALUES ($1) RETURNING *';
    const values = [name]
    const {rows} = await client.query(sql, values);
    return rows;
}

const update = async (id: string, name: string) => {
    const client = await db();
    const sql = 'UPDATE "Duty" SET "name" = $1 WHERE "id" = $2 RETURNING *';
    const values = [name, id]
    const {rows} = await client.query(sql, values);
    return rows;
}

const del = async (id: string) => {
    const client = await db();
    const sql = 'DELETE FROM "Duty" WHERE "id" = $1';
    const values = [id]
    const {rows} = await client.query(sql, values);
    return rows;
}

export {list, read, create, update, del}
