import pg from 'pg';
const { Pool } = pg

const pool = new Pool();
pool.on('connect', () => {console.log("Pool connected")});
pool.on('error', (err) => {console.log("An error occured while creating the pool : \n", err.message)});

export const query = async (text, params=undefined) => {
    const res = await pool.query(text, params).then((res) => res.rows).catch((err) => {
        console.error(`An error occured while excecuting : ${text} \n The Error : ${err.message}`);
    });
    return res;
}

export const getClient = () => {
    return pool.connect()
}

