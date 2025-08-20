/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/connect";
import productModel from "@/utils/model/product.model";
import { ProductType } from "@/types/productType";

const users = [
  { id: 1, name: "oslim", email: "oslim@gmail.com" },
  { id: 2, name: "sam", email: "sam@gmail.com" },
];

// const products = [
//   {
//     id: 1,
//     name: "Laptop",
//     price: 999.99,
//     inStock: true,
//     image: "/images/laptop.jpg",
//     description:
//       "High performance laptop with 16GB RAM and 512GB SSD, perfect for work and gaming.",
//     category: "Electronics",
//     brand: "TechBrand",
//     rating: 4.5,
//   },
//   {
//     id: 2,
//     name: "Smartphone",
//     price: 599.99,
//     inStock: false,
//     image: "/images/phone3.jpg",
//     description:
//       "Sleek smartphone with a stunning OLED display and powerful processor.",
//     category: "Electronics",
//     brand: "PhoneCo",
//     rating: 4.2,
//   },
//   {
//     id: 3,
//     name: "Headphone",
//     price: 199.99,
//     inStock: true,
//     image: "/images/headphone.jpg",
//     description:
//       "Noise-cancelling over-ear headphones with superior sound quality.",
//     category: "Audio",
//     brand: "SoundMaster",
//     rating: 4.7,
//   },
//   {
//     id: 4,
//     name: "Keyboard",
//     price: 49.99,
//     inStock: true,
//     image: "/images/keyboard.jpg",
//     description:
//       "Mechanical keyboard with customizable RGB backlighting and ergonomic design.",
//     category: "Accessories",
//     brand: "KeyPro",
//     rating: 4.3,
//   },
//   {
//     id: 5,
//     name: "Monitor",
//     price: 299.99,
//     inStock: false,
//     image: "/images/monitor2.jpg",
//     description:
//       "27-inch 4K UHD monitor with vibrant colors and ultra-thin bezel.",
//     category: "Electronics",
//     brand: "ViewMax",
//     rating: 4.6,
//   },
// ];

export const resolvers = {
  Query: {
    users: () => users,
    user: (_: any, { id }: { id: string }) => {
      const user = users.find((user) => user.id == Number(id));
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },

    products: async () => {
      await connectDB();
      const products = await productModel.find();
      return products;
    },
    product: async (_: any, { id }: { id: string }) => {
      // const product = products.find((product) => product.id == Number(id));
      await connectDB();
      const product = await productModel.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },
  },

  Mutation: {
    addProduct: async (_: any, payload: Omit<ProductType, "id">) => {
      // const dataToSave = {
      //   id: products.length + 1,
      //   ...payload,
      // };
      // products.push(dataToSave);
      // return dataToSave;

      try {
        await connectDB();
        const res = await productModel.create(payload);
        return res;
      } catch (error) {
        console.log(error);
      }
    },

    updateProduct: async (
      _: any,
      { id, ...payload }: { id: string } & Partial<ProductType> 
    ) => {
      await connectDB();
      const updatedProduct = await productModel.findByIdAndUpdate(id, payload, {
        new: true,
      });

      return updatedProduct;
    },

    deleteProduct: async (_: any, { id }: { id: string }) => {
      await connectDB();
      const deletedUser = await productModel.findByIdAndDelete(id);
      return !!deletedUser;
    },
  },
};
