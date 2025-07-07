"use client";
import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import client from "@/lib/apollo-client";

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $price: Float!
    $description: String!
    $category: String!
    $brand: String!
    $rating: Float!
    $inStock: Boolean!
    $image: String!
  ) {
    addProduct(
      name: $name
      price: $price
      description: $description
      category: $category
      brand: $brand
      rating: $rating
      inStock: $inStock
      image: $image
    ) {
      id
      name
      price
      inStock
      image
      description
      category
      brand
      rating
    }
  }
`;

const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

const CreateProduct = () => {
  const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);

  // Initialize numeric fields as empty strings to avoid NaN
  const [formData, setFormData] = useState({
    name: "",
    price: "", // string
    description: "",
    category: "",
    brand: "",
    rating: "", // string
    inStock: false,
    image: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  try {
    // Compress the image before upload
    const options = {
      maxSizeMB: 1,          // Max size 1MB
      maxWidthOrHeight: 1024 // Max width or height
    };
    const compressedFile = await imageCompression(file, options);

    const formDataCloud = new FormData();
    formDataCloud.append("file", compressedFile);
    formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formDataCloud,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary upload error:", data);
      alert("Image upload failed: " + (data.error?.message || "Unknown error"));
      setUploading(false);
      return;
    }

    if (data.secure_url) {
      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));
    } else {
      alert("Image upload failed, please try again.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Image upload error, please try again.");
  } finally {
    setUploading(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert("Please upload an image before submitting.");
      return;
    }

    // Convert numeric fields from string to numbers
    const priceNum = parseFloat(formData.price);
    const ratingNum = parseFloat(formData.rating);

    if (isNaN(priceNum) || isNaN(ratingNum)) {
      alert("Please enter valid numbers for price and rating.");
      return;
    }

    try {
      await addProduct({
        variables: {
          ...formData,
          price: priceNum,
          rating: ratingNum,
        },
      });
      alert("Product Created Successfully");
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        brand: "",
        rating: "",
        inStock: false,
        image: "",
      });

      client.resetStore();
      router.push("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 h-screen flex flex-col bg-white">
      <h2 className="text-xl font-semibold mb-4 text-black flex-shrink-0">
        Create Product
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex-grow overflow-y-auto space-y-3
          md:space-y-2
          md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-3"
      >
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-black">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 font-semibold text-black
              focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-semibold text-black">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 font-semibold text-black
              focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block mb-1 font-semibold text-black">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 font-semibold text-black
              focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-black">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 font-semibold text-black
              focus:outline-none focus:ring-2 focus:ring-blue-600 w-full resize-none"
            rows={3}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold text-black">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 font-semibold text-black
              focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block mb-1 font-semibold text-black">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 font-semibold text-black
              focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
          />
        </div>

        {/* In Stock */}
        <div className="flex items-center space-x-2 md:col-span-2">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
            className="rounded"
          />
          <label className="font-semibold text-black">In Stock</label>
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block mb-1 font-semibold text-black">
            Image Upload
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-black border border-gray-300 rounded"
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-1">Uploading image...</p>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded"
              className="mt-2 w-32 h-32 object-cover rounded-md border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading || !formData.image}
          className="md:col-span-2 w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300
            text-white font-semibold py-2 rounded-md transition"
        >
          {loading || uploading ? "Submitting..." : "Submit"}
        </button>

        {error && (
          <p className="md:col-span-2 text-red-600 mt-2">{error.message}</p>
        )}
      </form>
    </div>
  );
};

export default CreateProduct;
