import * as db from './index.js';
import {getUsers, getProducts} from '../lib/placeHolderDt.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

async function seedUsers(){
  await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      fname VARCHAR(255) NOT NULL,
      lname VARCHAR(255) NOT NULL,
      mname VARCHAR(255),
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );`);
  const users = await getUsers();
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
        return db.query(`
        INSERT INTO users(fname, lname, mname, email, password)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING;
      `, [user.name.firstname, user.name.lastname, "M" + user.name.firstname, user.email, hashedPassword]);
    })
  );
  return insertedUsers;
}
async function seedProducts(){
  await db.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NULL,
      price INT NOT NULL,
      "salePrice" INT NOT NULL,
      "totalStock" INT DEFAULT 1,
      images TEXT [] NULL
    );`);
  const products = await getProducts();

  
  const reg = /^(\[?")(.+)(\"\]?)/g;
  
  const insertedProducts = await  Promise.all(
    products.map((prod) => {    
      //remove the unecessassry caracters  sometimes appear in images list url from 
      const images = prod.images.map((image) => image.replace(reg, "$2"));
      console.log("Executed", images);
      return db.query(`
        INSERT INTO products(title, description, category, brand, price, "salePrice", images)
        VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [prod.title, prod.description, prod.category, prod.brand,
            prod.price, prod.price, [...images]])
  })
  );
  return insertedProducts;
}
async function addSearchCol(){
  db.query(`ALTER TABLE products
    ADD search TSVECTOR
    GENERATED ALWAYS AS (
      SETWEIGHT(TO_TSVECTOR('simple', title), 'A') || ' ' ||
      SETWEIGHT(TO_TSVECTOR('english', description),  'B') :: TSVECTOR
   ) STORED ` //tags should precede title when the tag is added
  );
}
/*
  *Creates the full text search for products  in the data base
*/
async function seedSearchFunction(){
  await db.query(`
      DROP FUNCTION IF EXISTS search_products(TEXT);
      CREATE OR REPLACE FUNCTION search_products(term TEXT)
      returns table(
        _id TEXT,
        title TEXT,
        description TEXT,
        category TEXT,
        brand TEXT,
        price NUMERIC,
        salePrice NUMERIC,
        totalStock INT,
        images TEXT[],
        rank REAL
      )
      as
      $$
      SELECT id, title, description, category, brand, price, "salePrice", "totalStock", images,
        ts_rank(search, websearch_to_tsquery('english', term)) +
        ts_ranK(search, websearch_to_tsquery('simple', term)) as rank
      FROM products
      WHERE search @@ websearch_to_tsquery('english', term)
      OR search @@ websearch_to_tsquery('simple', term)
      ORDER by rank desc;

      $$ language SQL;
    `)
}
const executer = async function(){
  try{
    await seedUsers();
    await seedProducts();
    await addSearchCol();
    await seedSearchFunction();
  }catch(err){
    console.log(err);
  }
}

export default executer;
