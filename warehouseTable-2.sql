
-- WAREHOUSES table
CREATE TABLE warehouses (
    warehouse_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Warehouse identification
    warehouse_code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'NYC-01', 'LA-MAIN'
    warehouse_name VARCHAR(150) NOT NULL,
    
    -- Location information
    address_id UUID NOT NULL REFERENCES addresses(address_id),
    
    -- Contact information
    phone VARCHAR(20),
    email VARCHAR(255),
    manager_id UUID NOT NULL  REFERENCES users(_id),
    
    -- Operational details
    warehouse_type VARCHAR(50) DEFAULT 'distribution'
        CHECK (warehouse_type IN ('fulfillment', 'distribution', 'returns', 'cross_dock')),
    
    -- Capacity and constraints
    max_capacity_cubic_meters DECIMAL(10, 2),
    max_weight_capacity_kg DECIMAL(10, 2),
    
    -- Operational hours (JSON for flexibility)
    operating_hours JSONB, -- e.g., {"monday": {"open": "08:00", "close": "18:00"}, ...}
    
    -- Shipping zones this warehouse serves (array of postal code prefixes)
    shipping_zones TEXT[], -- e.g., {'10', '11', '07'} for NYC area zip codes
    
    -- Warehouse capabilities
    can_ship_international BOOLEAN DEFAULT FALSE,
    can_handle_fragile BOOLEAN DEFAULT TRUE,
    can_handle_hazardous BOOLEAN DEFAULT FALSE,
    can_handle_frozen BOOLEAN DEFAULT FALSE,
    
    -- Priority for order assignment (lower number = higher priority)
    fulfillment_priority INTEGER DEFAULT 100,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);