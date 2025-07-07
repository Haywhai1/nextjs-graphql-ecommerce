import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  description: string;
  category: string;
  brand: string;
  rating: number;
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
