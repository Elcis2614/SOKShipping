import React from 'react';
import { 
  Html, 
  Body, 
  Container, 
  Section, 
  Heading, 
  Text, 
  Img, 
  Hr 
} from "@react-email/components";

export default function GetFormated({ data = [], orderInfo = {} }) {
  // Calculate totals
  const subtotal = data.reduce((sum, item) => {
    const price = Number(item?.total_price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);
  
  const formattedSubtotal = subtotal.toFixed(2);
  const shipping = orderInfo?.shipping || 0;
  const tax = orderInfo?.tax || 0;
  const total = formattedSubtotal + shipping + tax;

  return (
    <Html>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f6f6f6' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
          {/* Header */}
          <Section className="py-[24px] px-[24px] text-center bg-gray-50">
            <Heading as="h1" className="mb-[8px] font-bold text-[32px] leading-[40px] text-gray-900">
              Order Confirmation
            </Heading>
            {orderInfo?.orderNumber && (
              <Text className="text-gray-600 text-[16px] mb-0">
                Order #{orderInfo.orderNumber}
              </Text>
            )}
          </Section>

          {/* Main Content */}
          <Section className="px-[24px] py-[16px]">
            {/* Order Items */}
            <Section className="my-[24px] rounded-[12px] border border-gray-200 border-solid overflow-hidden">
              {/* Table Header */}
              <div style={{ backgroundColor: '#f8f9fa', padding: '16px' }}>
                <table width="100%" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '80px', textAlign: 'left', padding: '8px 0' }}>
                        <Text className="font-semibold text-gray-700 text-[14px] mb-0">Image</Text>
                      </th>
                      <th style={{ textAlign: 'left', padding: '8px 12px' }}>
                        <Text className="font-semibold text-gray-700 text-[14px] mb-0">Product</Text>
                      </th>
                      <th style={{ width: '80px', textAlign: 'center', padding: '8px 0' }}>
                        <Text className="font-semibold text-gray-700 text-[14px] mb-0">Qty</Text>
                      </th>
                      <th style={{ width: '100px', textAlign: 'right', padding: '8px 0' }}>
                        <Text className="font-semibold text-gray-700 text-[14px] mb-0">Price</Text>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Table Body */}
              <div style={{ padding: '0 16px' }}>
                <table width="100%" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    {data.length > 0 ? data.map((item, index) => (
                      <tr key={index} style={{ borderBottom: index < data.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                        <td style={{ width: '80px', padding: '16px 0' }}>
                          {item?.image && (
                            <Img
                              alt={item?.title || item?.product_title || 'Product'}
                              className="rounded-[8px] object-cover"
                              height={60}
                              width={60}
                              src={item.image}
                              style={{ border: '1px solid #e5e7eb' }}
                            />
                          )}
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <Text className="font-medium text-gray-900 text-[15px] mb-[4px]">
                            {item?.product_title || item?.title || 'Unknown Product'}
                          </Text>
                          {item?.variant && (
                            <Text className="text-gray-600 text-[13px] mb-0">
                              {item.variant}
                            </Text>
                          )}
                        </td>
                        <td style={{ width: '80px', textAlign: 'center', padding: '16px 0' }}>
                          <Text className="text-gray-900 text-[15px] mb-0">
                            {item?.quantity || 1}
                          </Text>
                        </td>
                        <td style={{ width: '100px', textAlign: 'right', padding: '16px 0' }}>
                          <Text className="font-medium text-gray-900 text-[15px] mb-0">
                            ${item?.total_price || 0}
                          </Text>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '32px' }}>
                          <Text className="text-gray-500">No items found</Text>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Order Summary */}
            <Section className="my-[24px]">
              <div style={{ maxWidth: '300px', marginLeft: 'auto' }}>
                <table width="100%" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <Text className="text-gray-700 text-[15px] mb-0">Subtotal:</Text>
                      </td>
                      <td style={{ padding: '8px 0', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>
                        <Text className="text-gray-900 text-[15px] mb-0">${formattedSubtotal}</Text>
                      </td>
                    </tr>
                    {shipping > 0 && (
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <Text className="text-gray-700 text-[15px] mb-0">Shipping:</Text>
                        </td>
                        <td style={{ padding: '8px 0', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>
                          <Text className="text-gray-900 text-[15px] mb-0">${shipping}</Text>
                        </td>
                      </tr>
                    )}
                    {tax > 0 && (
                      <tr>
                        <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                          <Text className="text-gray-700 text-[15px] mb-0">Tax:</Text>
                        </td>
                        <td style={{ padding: '8px 0', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>
                          <Text className="text-gray-900 text-[15px] mb-0">${tax}</Text>
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td style={{ padding: '16px 0 8px 0' }}>
                        <Text className="font-bold text-gray-900 text-[17px] mb-0">Total:</Text>
                      </td>
                      <td style={{ padding: '16px 0 8px 0', textAlign: 'right' }}>
                        <Text className="font-bold text-gray-900 text-[17px] mb-0">${total}</Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Additional Info */}
            {orderInfo?.customerInfo && (
              <Section className="my-[24px] p-[16px] bg-gray-50 rounded-[8px]">
                <Heading as="h3" className="text-[18px] font-semibold mb-[12px] text-gray-900">
                  Delivery Information
                </Heading>
                <Text className="text-gray-700 text-[14px] mb-[4px]">
                  {orderInfo.customerInfo.name}
                </Text>
                <Text className="text-gray-600 text-[14px] mb-0">
                  {orderInfo.customerInfo.address}
                </Text>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Section className="px-[24px] py-[24px] text-center bg-gray-50 border-t border-gray-200">
            <Text className="text-gray-600 text-[14px] mb-[8px]">
              Thank you for your order!
            </Text>
            <Text className="text-gray-500 text-[12px] mb-0">
              If you have any questions, please contact our support team.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}