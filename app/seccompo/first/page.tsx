"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Product } from "@/types/products";
import { getCartItems, removeFromCart, updateCartQuantity } from "@/app/actions/actions";
import Swal from "sweetalert2";
import { urlFor } from "@/sanity/lib/image";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const handleRemove = (id: string) => {
    Swal.fire({
      title: "Are you sure you want to remove this item?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      denyButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id);
        setCartItems(getCartItems());
        Swal.fire("Item removed", "", "success");
      }
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateCartQuantity(id, quantity);
    setCartItems(getCartItems());
  };

  const handleIncrement = (id: string) => {
    const product = cartItems.find((item) => item._id === id);
    if (product) handleQuantityChange(id, product.inventory + 1);
  };

  const handleDecrement = (id: string) => {
    const product = cartItems.find((item) => item._id === id);
    if (product && product.inventory > 1) handleQuantityChange(id, product.inventory - 1);
  };

  const calculatedTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.inventory, 0);
  };

  const router = useRouter();

  const handleProceed = () => {
    Swal.fire({
      title: "Are you sure you want to proceed to checkout?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes, proceed to checkout!",
      denyButtonText: "No",
      cancelButtonColor: "red",
      confirmButtonColor: "green",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Proceeding to checkout", "Your Order has been successfully processed", "success");
        router.push("/checkout ");
        setCartItems([]);
      };

      
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center space-x-4">
                {item.image && (
                    <Image src={urlFor(item.image).url()}
                    alt='image'
                    width={500}
                    height={500}
                  
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                  <div>
                    <h2 className="font-medium text-lg">{item.productName}</h2>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-md"
                    onClick={() => handleDecrement(item._id)}
                  >
                    -
                  </button>
                  <span>{item.inventory}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-md"
                    onClick={() => handleIncrement(item._id)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Price:</span>
                <span>${calculatedTotal().toFixed(2)}</span>
              </div>
            </div>
            <button
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              onClick={handleProceed}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
