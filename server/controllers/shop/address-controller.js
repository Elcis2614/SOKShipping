import Address from '../../models/Address.js';
import {adressManager} from '../../db/address-manager.js';

const addAddress = async(req, res) =>{
    try {
    await client.query('BEGIN');
    
    const {
      customer_id,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      address_type = 'shipping',
      first_name,
      last_name,
      company,
      phone,
      is_default_shipping = false,
      is_default_billing = false,
      delivery_instructions
    } = req.body;

    // Verify customer exists (optional check)
    const customerCheck = await client.query(
      'SELECT customer_id FROM customers WHERE customer_id = $1',
      [customer_id]
    );
    
    if (customerCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Insert the new address
    const insertQuery = `
      INSERT INTO addresses (
        customer_id, address_line1, address_line2, city, state, postal_code, country,
        address_type, first_name, last_name, company, phone, is_default_shipping,
        is_default_billing, delivery_instructions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      customer_id, address_line1, address_line2, city, state, postal_code, country,
      address_type, first_name, last_name, company, phone, is_default_shipping,
      is_default_billing, delivery_instructions
    ];

    const result = await client.query(insertQuery, values);
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    //await client.query('ROLLBACK');
    console.error('Error creating address:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create address',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    client.release();
  }
};

const fetchAllAddress = async(req, res) =>{
    try {
        const { userId } = req.params 
        if(!userId ){
            return res.status(400).json({
                success : false,
                message : 'User Id is required!'
            })
            
        }

        const addressList = await adressManager.getAdress(userId);

        res.status(200).json({
            success : true,
            data : addressList,
        })
        
    } catch (e) {
        //console.log(e);
        res.status(500).json({
          success: false,
          message: "Error",
        });
    }
    
}

const editAddress = async (req, res) => {
    try {
      const { userId, addressId } = req.params;
      const formData = req.body;
  
      if (!userId || !addressId) {
        return res.status(400).json({
          success: false,
          message: "User and address id is required!",
        });
      }
  
      const address = await Address.findOneAndUpdate(
        {
          _id: addressId,
          userId,
        },
        formData,
        { new: true }
      );
  
      if (!address) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }
  
      res.status(200).json({
        success: true,
        data: address,
      });
    } catch (e) {
      //console.log(e);
      res.status(500).json({
        success: false,
        message: "Error",
      });
    }
  };
  


const deleteAddress = async (req, res) => {
    try {
      const { userId, addressId } = req.params;
      if (!userId || !addressId) {
        return res.status(400).json({
          success: false,
          message: "User and address id is required!",
        });
      }
  
      const address = await Address.findOneAndDelete({ _id: addressId, userId });
  
      if (!address) {
        return res.status(404).json({
          success: false,
          message: "Address not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Address deleted successfully",
      });
    } catch (e) {
      //console.log(e);
      res.status(500).json({
        success: false,
        message: "Error",
      });
    }
  };
  
export {addAddress, editAddress, fetchAllAddress, deleteAddress };