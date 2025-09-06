import * as db from './index.js';

export const adressManager = {
    async getAdress(userId){
        const qText = `SELECT address_id, address_line1, city, state, postal_code, country
                        FROM addresses WHERE customer_id=$1`
        const result = await db.query(qText, [userId]);
        return result;
    },
    async addAddress({customer_id, address_line1, address_line2, city, state, postal_code, country,
      address_type, first_name, last_name, company, phone, is_default_shipping,
      is_default_billing, delivery_instructions}) {
        await query('BEGIN');
        const insertQuery = `
            INSERT INTO addresses (
                customer_id, address_line1, address_line2, city, state, postal_code, country,
                address_type, first_name, last_name, company, phone, is_default_shipping,
                is_default_billing, delivery_instructions
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *
        `;
        const values = [customer_id, address_line1, address_line2, city, state, postal_code, country,
      address_type, first_name, last_name, company, phone, is_default_shipping,
      is_default_billing, delivery_instructions];
      const result = await db.query(insertQuery, values);
      await db.query('COMMIT');
    },

    async updateAddress() {
    }
}