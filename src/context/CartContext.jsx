import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({
  children
}) => {

  // LOAD CART FROM LOCAL STORAGE
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ASYNC LOADING STATES
  const [loadingItemIds, setLoadingItemIds] = useState([]);
  
  // DRAWER VISIBILITY STATE
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // SAVE CART TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // NORMALIZE PRODUCT SCHEMA
  const normalizeProduct = (product) => {
    return {
      id: String(product.id),
      title: product.title || product.name || 'Unnamed Product',
      price: Number(product.price) || 0,
      image: product.image || product.mainImage || product.hoverImage || '/assets/default.png',
      category: product.category || 'Uncategorized',
      tag: product.tag || ''
    };
  };

  // SIMULATE NETWORK DELAY (600ms)
  const simulateNetwork = () => new Promise((resolve) => setTimeout(resolve, 600));

  // ADD TO CART (Async with Optimistic UI & Rollback)
  const addToCart = async (product) => {
    const qty = Number(product.quantity) || 1;
    const normalized = normalizeProduct(product);
    const productId = normalized.id;

    // Keep snapshot for potential rollback
    const rollbackSnapshot = [...cart];

    // Optimistic UI Update: immediately update client state
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...normalized, quantity: qty }];
    });

    // Start loading state for this product
    setLoadingItemIds((prev) => [...prev, productId]);

    try {
      // Simulate network request
      await simulateNetwork();
      
      // Auto open drawer to provide instant premium feedback
      setIsDrawerOpen(true);
    } catch (error) {
      // Rollback on failure
      setCart(rollbackSnapshot);
      toast.error('Failed to add item. Please try again.');
      throw error;
    } finally {
      // Stop loading state
      setLoadingItemIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  // UPDATE QUANTITY (Async with Optimistic UI & Rollback)
  const updateQuantity = async (id, amount) => {
    const productId = String(id);
    const rollbackSnapshot = [...cart];

    // Optimistic UI Update
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );

    setLoadingItemIds((prev) => [...prev, productId]);

    try {
      await simulateNetwork();
    } catch (error) {
      setCart(rollbackSnapshot);
      toast.error('Failed to update quantity.');
      throw error;
    } finally {
      setLoadingItemIds((prev) => prev.filter((itemId) => itemId !== productId));
    }
  };

  // REMOVE SINGLE ITEM (Async with Optimistic UI & Rollback)
  const removeFromCart = async (id) => {
    const productId = String(id);
    const rollbackSnapshot = [...cart];

    // Optimistic UI Update
    setCart((prev) => prev.filter((item) => item.id !== productId));

    setLoadingItemIds((prev) => [...prev, productId]);

    try {
      await simulateNetwork();
    } catch (error) {
      setCart(rollbackSnapshot);
      toast.error('Failed to remove item.');
      throw error;
    } finally {
      setLoadingItemIds((prev) => prev.filter((itemId) => itemId !== productId));
    }
  };

  // CLEAR WHOLE CART
  const clearCart = async () => {
    const rollbackSnapshot = [...cart];
    setCart([]);
    localStorage.removeItem('cart');

    setLoadingItemIds((prev) => [...prev, 'clear']);

    try {
      await simulateNetwork();
    } catch (error) {
      setCart(rollbackSnapshot);
      localStorage.setItem('cart', JSON.stringify(rollbackSnapshot));
      toast.error('Failed to clear cart.');
      throw error;
    } finally {
      setLoadingItemIds((prev) => prev.filter((itemId) => itemId !== 'clear'));
    }
  };

  // TOTAL ITEMS
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // TOTAL PRICE
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        loadingItemIds,
        isDrawerOpen,
        setIsDrawerOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);