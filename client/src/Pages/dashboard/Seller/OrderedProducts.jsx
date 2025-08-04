import React from 'react';
import SellerChat from '../../../components/Chat/SellerChat';

const OrderedProducts = () => {
  const sellerId = "seller123";
    return (
      <div>
         <SellerChat sellerId={sellerId} />
      </div>
    );
};

export default OrderedProducts;