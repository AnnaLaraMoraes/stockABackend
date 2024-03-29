import Mongoose from 'mongoose';
import MongooseUniqueValidator from 'mongoose-unique-validator';

const CategoriesSchema = new Mongoose.Schema(
  {
    code: {
      type: Number,
      min: 1,
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    label: { type: String, required: true },
    productType: {
      type: String,
      enum: ['clothes', 'shoes', 'accessories'],
      required: true,
    },
  },
  { timestamps: true }
);

CategoriesSchema.plugin(MongooseUniqueValidator);

export default Mongoose.model('Categories', CategoriesSchema);
