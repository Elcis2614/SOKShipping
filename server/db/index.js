import pg from 'pg';
const { Pool } = pg

const pool = new Pool();
pool.on('connect', () => { console.log("Pool connected") });
pool.on('error', (err) => { console.log("An error occured while creating the pool : \n", err.message) });

export const query = async (text, params = undefined) => {
    const res = await pool.query(text, params).then((res) => res.rows).catch((err) => {
        throw new Error(`An error occured while excecuting : ${text} \n The Error : ${err.message}`);
    });
    return res;
}

export const getClient = () => {
    return pool.connect();
}

export const isValidUser = async(email) => {
    const queryTxt = 'SELECT FROM users WHERE email=$1';
    const result = await query(queryTxt, [email]);
    return result[0];
}

export const createUser = async({fname, lname, email, password}) => {
    const queryTxt = 'INSERT INTO users(fname, lname, email, password) \
                    VALUES ($1,$2,$3,$4)';
    const result = await query(queryTxt, [fname, lname, email, password]);
    return result;
}

export const getFeatureImages = async () => {
    const queryTxt = 'SELECT * FROM features';
    const result = await query(queryTxt);
    return result;
}

export const insertFeature = async ({ image, title, subtitle }) => {
    const queryTxt = 'INSERT INTO features(image, title, subtitle) VALUES ($1, $2, $3)';
    const result = await query(query, [image, title, subtitle]);
    return result;
}

export const deleteFeaute = async ({ id }) => {
    const queryTxt = 'DELETE FROM features where _id=${1}';
    const result = await query(queryTxt, [id]);
    return result;
}

export const countFeatures = async () => {
    const result = await query('SELECT count(*) FROM features');
    return result;
}

export const findFeatureById = async ({ id }) => {
    return await query('SELECT image FROM features where _id=${1}', [id]);
}


