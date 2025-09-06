CREATE TABLE addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    customer_id UUID,
    
    -- Address components
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    
    -- Address metadata
    address_type VARCHAR(50) DEFAULT 'shipping' 
        CHECK (address_type IN ('shipping', 'billing', 'both')),

    
    -- Address validation and formatting
    is_validated BOOLEAN DEFAULT FALSE,
    formatted_address TEXT, -- Standardized address from validation service
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Special instructions
    delivery_instructions TEXT,
    
    -- Status flags
    is_active BOOLEAN DEFAULT TRUE,
    is_default_shipping BOOLEAN DEFAULT FALSE,
    is_default_billing BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE
);


CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    customer_id UUID,
    customer_email VARCHAR(255) NOT NULL,
    
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    
    shipping_address_id UUID NOT NULL REFERENCES addresses(address_id),
    billing_address_id UUID NOT NULL REFERENCES addresses(address_id),
    
    shipping_method VARCHAR(100),
    
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded')),
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255),
    
    -- Tracking and fulfillment
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Special instructions and notes
    order_notes TEXT,
    customer_notes TEXT,
    
    -- Metadata
    source VARCHAR(100) DEFAULT 'web' 
        CHECK (source IN ('web', 'mobile_app', 'api', 'phone', 'in_store')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for addresses table
CREATE INDEX idx_addresses_customer_id ON addresses(customer_id);
CREATE INDEX idx_addresses_postal_code ON addresses(postal_code);
CREATE INDEX idx_addresses_country ON addresses(country);
CREATE INDEX idx_addresses_is_active ON addresses(is_active);
CREATE INDEX idx_addresses_address_type ON addresses(address_type);
CREATE INDEX idx_addresses_created_at ON addresses(created_at);

-- Indexes for orders table
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_shipping_address_id ON orders(shipping_address_id);
CREATE INDEX idx_orders_billing_address_id ON orders(billing_address_id);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_addresses_updated_at 
    BEFORE UPDATE ON addresses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default address per customer per type
CREATE OR REPLACE FUNCTION enforce_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting as default shipping, remove default from other shipping addresses
    IF NEW.is_default_shipping = TRUE AND NEW.customer_id IS NOT NULL THEN
        UPDATE addresses 
        SET is_default_shipping = FALSE 
        WHERE customer_id = NEW.customer_id 
        AND address_id != NEW.address_id 
        AND is_default_shipping = TRUE;
    END IF;
    
    -- If setting as default billing, remove default from other billing addresses
    IF NEW.is_default_billing = TRUE AND NEW.customer_id IS NOT NULL THEN
        UPDATE addresses 
        SET is_default_billing = FALSE 
        WHERE customer_id = NEW.customer_id 
        AND address_id != NEW.address_id 
        AND is_default_billing = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_default_address_trigger
    BEFORE INSERT OR UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION enforce_single_default_address();

-- Function to update last_used_at when address is used in an order
CREATE OR REPLACE FUNCTION update_address_last_used()
RETURNS TRIGGER AS $$
BEGIN
    -- Update shipping address last used
    UPDATE addresses 
    SET last_used_at = CURRENT_TIMESTAMP 
    WHERE address_id = NEW.shipping_address_id;
    
    -- Update billing address last used (if different from shipping)
    IF NEW.billing_address_id != NEW.shipping_address_id THEN
        UPDATE addresses 
        SET last_used_at = CURRENT_TIMESTAMP 
        WHERE address_id = NEW.billing_address_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_address_last_used_trigger
    AFTER INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_address_last_used();

-- Order number generation
CREATE SEQUENCE order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
BEGIN
    RETURN 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
           LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- 1. Insert an address
-- INSERT INTO addresses (customer_id, address_line1, city, postal_code, country, first_name, last_name, phone)
-- VALUES (gen_random_uuid(), '123 Main St', 'New York', '10001', 'USA', 'John', 'Doe', '+1234567890');

-- 2. Create order with address references
-- INSERT INTO orders (order_number, customer_id, customer_email, subtotal, total_amount, shipping_address_id, billing_address_id)
-- VALUES (generate_order_number(), customer_uuid, 'john@example.com', 99.99, 99.99, shipping_addr_uuid, billing_addr_uuid);