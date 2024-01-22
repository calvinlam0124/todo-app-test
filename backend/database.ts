import {Pool} from 'pg';

let mainPool: Pool | null = null;
const db = () => {
    if (mainPool) {
        return mainPool;
    }
    return new Pool({
        max: 20,
        connectionString: 'postgres://db_user:123456!@db:5432/db_name',
        idleTimeoutMillis: 30 * 1000
    });
}

export default db;
