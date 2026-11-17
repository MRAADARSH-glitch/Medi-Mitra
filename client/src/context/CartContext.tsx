import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Medicine } from "@shared/schema";

type CartItem = Omit<Medicine, "price"> & { price: number; quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (medicine: Medicine) => void;
  removeFromCart: (id: number) => void;
  changeQuantity: (id: number, type: "inc" | "dec") => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      if (saved) {
        return JSON.parse(saved).map((item: any) => ({
          ...item,
          price: Number(item.price),
        }));
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (medicine: Medicine) => {
    setCart((prev) => {
      const priceNumber = Number(medicine.price);
      const exist = prev.find((i) => i.id === medicine.id);

      if (exist) {
        return prev.map((i) =>
          i.id === medicine.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [...prev, { ...medicine, quantity: 1, price: priceNumber }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const changeQuantity = (id: number, type: "inc" | "dec") => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          if (type === "inc") return { ...i, quantity: i.quantity + 1 };
          if (type === "dec" && i.quantity > 1)
            return { ...i, quantity: i.quantity - 1 };
        }
        return i;
      })
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, changeQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
