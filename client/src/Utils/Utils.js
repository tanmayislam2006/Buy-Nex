  const calculateShipping = ( totalAmount) => {
    if (!totalAmount) return 0;
    const shippingRate = 0.15;
    const totalShipping = Math.floor(
      totalAmount * shippingRate
    )
    if (totalShipping < 80) {
      return 80;
    }
    return totalShipping;
};
  
  const calculateTotalAmount = (totalAmount) => {
    const sh = calculateShipping(totalAmount);
    return (totalAmount + sh).toFixed(2);
  };




export {calculateShipping,calculateTotalAmount}