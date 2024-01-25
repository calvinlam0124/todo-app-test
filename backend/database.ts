import {Pool, PoolClient} from 'pg';

let mainPool: Promise<PoolClient> | null = null;
const db = () => {
    if (mainPool) {
        return mainPool;
    }
    const pool = new Pool({
        max: 2,
        connectionString: 'postgres://db_user:123456!@db:5432/db_name',
        idleTimeoutMillis: 30 * 1000
    });
    mainPool = pool.connect();
    return mainPool;
}

export default db;
