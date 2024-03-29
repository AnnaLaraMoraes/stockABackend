import Mongoose from 'mongoose';
import MongooseUniqueValidator from 'mongoose-unique-validator';

const ProductsSchema = new Mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    size: { type: String, required: false },
    costValue: { type: Number, required: true },
    amountStock: { type: Number, required: true },
    costSale: { type: Number, required: true },
    description: { type: String, required: false },
    category: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    subcategory: {
      type: String,
      enum: ['female', 'male', 'boy', 'girl'],
      required: true,
    },
    productType: {
      type: String,
      enum: ['clothes', 'shoes', 'accessories'],
      required: true,
    },
    productStockType: {
      type: String,
      enum: ['wholesale', 'retail'],
      required: true,
    },
    provider: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Stakeholders',
    },
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    date: {
      type: Date,
      required: true,
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

ProductsSchema.plugin(MongooseUniqueValidator);

export default Mongoose.model('Products', ProductsSchema);
