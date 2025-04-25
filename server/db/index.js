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

export const insertProduct = async ({images,title,description,category,price,salePrice,totalStock,tags}) => {
    const queryTxt = `INSERT INTO products(title, description, category, price, "salePrice", images, tags)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const result = await query(queryTxt, [title, description, category, price, salePrice, [...images], [...tags]]);
    return result;
}

export const updateProduct = async({images,title,description,category,price,salePrice,totalStock,tags}, id) => {
    const queryTxt = 'UPDATE products set title=$1, description=$2, category=$3, price=$4, "salePrice"=$5, images=$6, tags=$7 WHERE _id=$8';
    const result = await query(queryTxt, [title, description, category, price, salePrice, [...images], [...tags], id]);
    return result;
}

export const deleteProductById = async(id) => {
    const queryTxt = 'DELETE FROM products where _id=$1';
    const result = await query(queryTxt, [id]);
    return result;
}

export const getFeatureImages = async()=>{
    const queryTxt = 'SELECT * FROM features';
    const result = await query(queryTxt);
    return result;
}