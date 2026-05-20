import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

const CartContext = createContext();

export const CartProvider = ({
  children
}) => {

  // LOAD CART FROM LOCAL STORAGE
  const [cart, setCart] = useState(() => {

    const savedCart =
      localStorage.getItem('cart');

    return savedCart
      ? JSON.parse(savedCart)
      : [];

  });

  // SAVE CART TO LOCAL STORAGE
  useEffect(() => {

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

  }, [cart]);

  // ADD TO CART
  const addToCart = (product) => {

    setCart((prev) => {

      const existing = prev.find(
        (item) =>
          item.id === product.id
      );

      // IF PRODUCT EXISTS
      if (existing) {

        return prev.map((item) =>

          item.id === product.id

            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }

            : item
        );
      }

      // NEW PRODUCT
      return [

        ...prev,

        {
          ...product,
          quantity: 1
        }

      ];

    });
  };

  // UPDATE QUANTITY
  const updateQuantity = (
    id,
    amount
  ) => {

    setCart((prev) =>

      prev.map((item) =>

        item.id === id

          ? {
              ...item,

              quantity: Math.max(
                1,
                item.quantity + amount
              )
            }

          : item
      )
    );
  };

  // REMOVE SINGLE ITEM
  const removeFromCart = (
    id
  ) => {

    setCart((prev) =>

      prev.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // CLEAR WHOLE CART
  const clearCart = () => {

    setCart([]);

    localStorage.removeItem(
      'cart'
    );

  };

  // TOTAL ITEMS
  const totalItems =
    cart.reduce(

      (acc, item) =>

        acc + item.quantity,

      0
    );

  // TOTAL PRICE
  const totalPrice =
    cart.reduce(

      (acc, item) =>

        acc +
        item.price *
          item.quantity,

      0
    );

  return (

    <CartContext.Provider

      value={{

        cart,

        addToCart,

        updateQuantity,

        removeFromCart,

        clearCart,

        totalItems,

        totalPrice

      }}

    >

      {children}

    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);