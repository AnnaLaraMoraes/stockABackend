import Mongoose from 'mongoose';
import MongooseUniqueValidator from 'mongoose-unique-validator';

const FinancesSchema = new Mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['input', 'output'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    saleId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Sales',
    },
    productId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Products',
    },
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  { timestamps: true }
);

FinancesSchema.plugin(MongooseUniqueValidator);

export default Mongoose.model('Finances', FinancesSchema);
