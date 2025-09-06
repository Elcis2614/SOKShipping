import * as db from './index.js';
export const orderService = {
    async createOrder(){
        qText = `INSERT INTO orders(customer_id, customer_email, subtotal)`;
    },
}