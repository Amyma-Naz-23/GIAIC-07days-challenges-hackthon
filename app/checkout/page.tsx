'use client';

import { Product } from '@/types/products';
import React, { useEffect, useState } from 'react';
import { getCartItems } from '../actions/actions';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { CgChevronRight } from 'react-icons/cg';
import { client } from '@/sanity/lib/client';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [discount, setDiscount] = useState<number>(0);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        country: "",
        city: "",
        zipCode: "",
        phone: "",
    });

    const [formErrors, setFormErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        address: false,
        country: false,
        city: false,
        zipCode: false,
        phone: false,
    });

    useEffect(() => {
        setCartItems(getCartItems());
        const appliedDiscount = localStorage.getItem("appliedDiscount");
        if (appliedDiscount) {
            setDiscount(Number(appliedDiscount));
        }
    }, []);

    const subTotal = cartItems?.reduce((total, item) => total + item.price * item.inventory, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    const validateForm = () => {
        const errors = {
            firstName: !formValues.firstName,
            lastName: !formValues.lastName,
            email: !formValues.email,
            address: !formValues.address,
            country: !formValues.country,
            city: !formValues.city,
            zipCode: !formValues.zipCode,
            phone: !formValues.phone,
        };
        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            Swal.fire({
                title: 'Error!',
                text: "Please fill all the required fields",
                icon: "error"
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Processing your order',
            text: 'Please wait...',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonColor: '#d33',
        });

        if (!result.isConfirmed) return;

        localStorage.removeItem('appliedDiscount');

        const orderData = {
            _type: 'order',
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            address: formValues.address,
            country: formValues.country,
            city: formValues.city,
            zipCode: formValues.zipCode,
            phone: formValues.phone,
            cartItems: cartItems.map(item => ({
                _type: 'reference',
                _ref: item._id,
            })),
            total: subTotal,
            discount: discount,
            orderDate: new Date().toISOString(),
        };

        try {
            await client.create(orderData);
            Swal.fire({
                title: "Success",
                text: "Your order has been placed",
                icon: "success"
            });
        } catch (error) {
            console.error('Failed to place order', error);
            Swal.fire({
                title: "Error!",
                text: "Failed to place your order. Please try again later.",
                icon: "error"
            });
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
            <div className='max-w-4xl w-full bg-white p-10 rounded-lg shadow-xl'>
                <nav className='flex items-center gap-2 pb-6 text-gray-500 text-sm'>
                    <Link href="/cart" className='hover:text-gray-900 transition'>Cart</Link>
                    <CgChevronRight />
                    <span className='text-gray-900 font-semibold'>Checkout</span>
                </nav>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                    <div>
                        <h2 className='text-xl font-semibold mb-4 text-gray-900'>Billing Information</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {Object.keys(formValues).map((field) => (
                                <div key={field}>
                                    <label htmlFor={field} className='block text-sm font-medium text-gray-700'>{field.replace(/([A-Z])/g, ' $1')}</label>
                                    <input 
                                        type='text' 
                                        id={field} 
                                        value={formValues[field as keyof typeof formValues]} 
                                        onChange={handleInputChange} 
                                        placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`} 
                                        className='mt-2 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition' 
                                    />
                                    {formErrors[field as keyof typeof formErrors] && (
                                        <p className='text-red-500 text-xs mt-1'>{field.replace(/([A-Z])/g, ' $1')} is required</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={handlePlaceOrder} 
                            className='mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium shadow-md'>
                            Proceed to Payment
                        </button>
                    </div>
                    <div className='bg-gray-50 p-6 rounded-lg shadow-lg'>
                        <h2 className='text-xl font-semibold mb-4 text-gray-900'>Order Summary</h2>
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item._id} className='flex items-center border-b py-4'>
                                    <div className='w-16 h-16 rounded-lg overflow-hidden border'>
                                        {item.image && (
                                            <Image
                                                src={urlFor(item.image).url()}
                                                alt='Product Image'
                                                width={64}
                                                height={64}
                                                className='object-cover w-full h-full'
                                            />
                                        )}
                                    </div>
                                    <div className='flex-1 ml-4'>
                                        <h3 className='text-sm font-medium text-gray-900'>{item.productName}</h3>
                                        <p className='text-xs text-gray-500'>Quantity: {item.inventory}</p>
                                    </div>
                                    <p className='font-semibold text-gray-900'>${item.price * item.inventory}</p>
                                </div>
                            ))
                        ) : (
                            <p className='text-sm font-medium text-gray-600'>No items in cart</p>
                        )}
                        <div className='text-right pt-6'>
                            <p className='text-sm text-gray-700'>Subtotal: <span className='font-semibold text-gray-900'>${subTotal}</span></p>
                            <p className='text-sm text-gray-700'>Discount: <span className='font-semibold text-gray-900'>${discount}</span></p>
                            <p className='text-lg font-semibold text-gray-900 mt-2'>Total: <span>${(subTotal - discount).toFixed(2)}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
