"use client";

import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from "react";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_PRESCRIPTION"; payload: { id: string; url: string } };

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setPrescription: (id: string, url: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.medicineId === action.payload.medicineId &&
          item.pharmacyId === action.payload.pharmacyId
      );
      if (existingIndex >= 0) {
        const newItems = state.items.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + action.payload.quantity } : item
        );
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.medicineId !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.medicineId === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "SET_PRESCRIPTION":
      return {
        ...state,
        items: state.items.map((item) =>
          item.medicineId === action.payload.id
            ? { ...item, prescriptionUrl: action.payload.url }
            : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "HYDRATE":
      return { ...state, items: action.payload };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Persist the cart in the browser so it survives reloads.
  const hydrated = useRef(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vitahub-cart") || "[]");
      if (Array.isArray(saved) && saved.length) dispatch({ type: "HYDRATE", payload: saved });
    } catch {}
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem("vitahub-cart", JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const addItem = (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const setPrescription = (id: string, url: string) =>
    dispatch({ type: "SET_PRESCRIPTION", payload: { id, url } });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setPrescription,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
