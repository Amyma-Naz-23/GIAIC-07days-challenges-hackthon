"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Product } from "@/types/products";
import { client } from "@/sanity/lib/client";
import { allProducts } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { addToCart } from "@/app/actions/actions";
import Swal from "sweetalert2";

const SHOES = () => {
  const [product, setProduct] = useState<Product[]>([])

  useEffect (()=>{
    async function fetchProducts() {
      const fetchedproduct : Product[] = await client.fetch(allProducts)
      setProduct(fetchedproduct)

    }

    fetchProducts()
  },[]);

  const handleAddToCart = (e:React.MouseEvent, product:Product) =>{
    e.preventDefault()
    addToCart(product)

    Swal.fire({
      position: 'top-right',
      icon: 'success', 
      title: `${product.productName} added to cart`,
      showConfirmButton: false,
      timer: 1000 
    });
  }

  return(
    <div className="max-w-6xl mx-auto px-4 py-8 font-extrabold">
      <h1 className="text-center text-4xl" >
        Our Latest Shoes Product
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

      {product.map((product)=>(
        <div key={product._id}
        className="border rounded-lg shadow-md hover:shadow-lg transition duration-200"
        >
          <Link href={`/product/${product.slug.current}`}>
          
          {product.image && (
            <Image
            src= {urlFor(product.image).url()}
            alt="image"
            width={200}
            height={200}
            className='w-full h-48 object-cover rounded-md'/> 
              
          
          )}
          <h1 className="text-lg font-semibold mt-4">
            {product.productName}
          </h1>
          <p className="text-gray-500 mt-2">
             {product.price ? `$${product.price}` :"Price not avaible"}
          </p>

          <button className="bg-gradient-to-r from-red-500 to bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-110 transition-transform duration-300 ease-in-out "
           onClick={(e) => handleAddToCart(e, product)}>Add To Cart

          </button>
          </Link>
        </div>
      )
    )}
    
    </div>
    </div>
  )


};

export default SHOES;
