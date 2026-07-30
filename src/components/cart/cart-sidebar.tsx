"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border/50 z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="font-semibold">Shopping Cart</span>
                <span className="text-sm text-muted-foreground">({items.length})</span>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Clear all
                  </button>
                )}
                <button onClick={toggleCart} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add medicines to get started</p>
                  <Button onClick={toggleCart} variant="primary">
                    Browse Medicines
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.medicineId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 group hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-blue-10 flex items-center justify-center shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {item.medicineName.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.medicineName}</h4>
                      <p className="text-xs text-muted-foreground">{item.dosage} | {item.pharmacyName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-semibold text-primary">{formatPrice(item.unitPrice)}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => item.quantity > 1 && updateQuantity(item.medicineId, item.quantity - 1)}
                            className="p-1 rounded-md hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                            className="p-1 rounded-md hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.medicineId)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border/50 p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border/50">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <Link href="/cart">
                  <Button variant="primary" size="lg" className="w-full" onClick={toggleCart}>
                    Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
