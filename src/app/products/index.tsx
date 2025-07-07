"use client";

import { ProductType } from "@/types/productType";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

const GET_PRODUCTS = gql`
  query GETPRODUCTS {
    products {
      id
      name
      price
      inStock
      image
      rating
    }
  }
`;

const ProductList = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching data</p>;
  console.log(data);

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen max-w-7xl mx-auto">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Explore Products</h1>
        <button
          type="button"
          aria-label="Add new product"
          className="p-2 rounded-full bg-black hover:bg-gray-900 text-white shadow-md transition"
        >
          <Link href={"/products/create-product"}>
          {/* Plus icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          </Link>
        </button>
      </div>

      {/* Product cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.products.map((product: ProductType) => (
          <div
            key={product.id}
            className="flex justify-between items-start gap-4 border rounded-lg p-4 shadow hover:shadow-md bg-gray-950 transition duration-200"
          >
            {/* Left: Product Info */}
            <div className="flex-1">
              <Link href={`/products/${product.id}`}>
                <h2 className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer">
                  {product.name}
                </h2>
              </Link>
              <p className="mt-2 text-gray-700 text-lg font-bold">
                ${product.price.toFixed(2)}
              </p>

              {/* Rating */}
              <p className="mt-1 text-yellow-500 text-sm font-semibold">
                {Array.from({ length: 5 }, (_, i) =>
                  i < Math.floor(product.rating ?? 0) ? (
                    <span key={i}>⭐</span>
                  ) : (
                    <span key={i} className="text-gray-300">⭐</span>
                  )
                )}
                <span className="text-gray-600 ml-2">({(product.rating ?? 0).toFixed(1)})</span>
              </p>

              <p
                className={`mt-1 text-sm font-medium ${
                  product.inStock ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {/* Right: Image */}
            <div className="w-[160px] h-[110px] relative flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
