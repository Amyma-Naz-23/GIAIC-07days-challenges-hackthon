import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Product } from "@/types/products";
import { groq } from "next-sanity";
import Image from "next/image";

// Define the params type correctly
interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Use `generateStaticParams` to handle the params fetching
export async function generateStaticParams() {
  const slugs = await client.fetch(
    groq`*[_type == "product" && slug.current != null].slug.current`
  );
  return slugs.map((slug: string) => ({
    slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  if (!params?.slug) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-red-500">Error: Slug is missing</h1>
      </div>
    );
  }

  const product: Product | null = await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0] {
      _id,
      productName,
      _type,
      image,
      description,
      status,
      price,
    }`,
    { slug: params.slug }
  );

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-red-500">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square">
          {product.image && (
            <Image
              src={urlFor(product.image).url()}
              alt={product.productName}
              width={500}
              height={500}
              className="rounded-lg shadow-lg object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-bold">{product.productName}</h1>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </p>
            <span
              className={`px-4 py-1 rounded-full text-white ${
                product.status === "In Stock"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {product.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
