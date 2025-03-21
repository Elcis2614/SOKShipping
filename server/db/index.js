import pg from 'pg';
const { Pool } = pg

const pool = new Pool();
pool.on('connect', () => {console.log("Pool connected")});
pool.on('error', (err) => {console.log("An error occured while creating the pool : \n", err.message)});

export const query = async (text, params=undefined) => {
    const res = await pool.query(text, params).then((res) => res.rows).catch((err) => {
         throw new Error(`An error occured while excecuting : ${text} \n The Error : ${err.message}`);
    });
    return res;
}

export const getClient = () => {
    return pool.connect()
}

export const insertProduct = async (
    {images,title,description,category,price,salePrice,totalStock,tags}) => {
    const queryTxt = `INSERT INTO products(title, description, category, price, "salePrice", images, tags)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const result = await query(queryTxt, [title, description, category, price, salePrice, [...images], [...tags]]);
    return result;
}
