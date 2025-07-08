"use client";
import Image from "next/image";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";

const PRODUCT = gql`
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      name
      price
      inStock
      image
      description
      brand
      rating
    }
  }
`;

const SingleProduct = () => {
  const { id } = useParams();

  const { data, loading, error } = useQuery(PRODUCT, {
    variables: { id },
  });

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Error loading product.</p>;

  const product = data.product;

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row lg:items-center bg-gray-50 ">
  {/* Image container */}
  <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full">
    <Image
      src={product.image}
      alt={product.image}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 50vw"
      priority
    />
  </div>

  {/* Details container */}
  <div className="flex-1 flex flex-col justify-center overflow-y-auto bg-white p-8">
    <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
    <p className="text-gray-600 mt-1 text-lg">{product.brand}</p>
    <p className="mt-4 text-gray-800">{product.description || "No description available."}</p>

    <p className="mt-6 text-3xl font-semibold text-blue-700">${product.price.toFixed(2)}</p>

    <p
      className={`mt-2 font-medium ${
        product.inStock ? "text-green-600" : "text-red-500"
      }`}
    >
      {product.inStock ? "In Stock" : "Out of Stock"}
    </p>

    <div className="mt-4 flex items-center text-yellow-400">
      {Array.from({ length: 5 }, (_, i) =>
        i < Math.floor(product.rating ?? 0) ? (
          <span key={i} className="text-2xl">⭐</span>
        ) : (
          <span key={i} className="text-2xl text-gray-300">⭐</span>
        )
      )}
      <span className="ml-2 text-gray-600 text-sm">({(product.rating ?? 0).toFixed(1)})</span>
    </div>

    <Link
      href="/"
      className="inline-block mt-8 px-6 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
    >
      ← Back to products
    </Link>
  </div>
</div>

  );
};

export default SingleProduct;
