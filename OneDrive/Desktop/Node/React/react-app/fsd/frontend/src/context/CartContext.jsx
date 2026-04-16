import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  );

  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { address: '', phone: '' }
  );

  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : 'COD'
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === product._id ? { ...existItem, quantity: x.quantity + quantity } : x
        )
      );
    } else {
      setCartItems([...cartItems, {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        quantity
      }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((x) => (x.product === id ? { ...x, quantity } : x))
    );
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem('paymentMethod', data);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = (itemsPrice > 500 || shippingAddress?.address === 'Store Pickup') ? 0 : 40;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveShippingAddress,
        savePaymentMethod,
        clearCart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
