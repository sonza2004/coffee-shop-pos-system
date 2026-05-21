import { createContext, useContext, useEffect, useState } from "react";

export type Product = {
  id: string;
  name: string;
  price: number;
  stockQty: number;
};

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);

      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id
            ? { ...c, qty: c.qty + 1 }
            : c
        );
      }

      return [...prev, { product, qty: 1 }];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
