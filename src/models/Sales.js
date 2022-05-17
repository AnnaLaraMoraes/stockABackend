import Mongoose from 'mongoose';
import MongooseUniqueValidator from 'mongoose-unique-validator';

const SalesSchema = new Mongoose.Schema(
  {
    paymentType: {
      type: String,
      enum: ['cash', 'creditCard'],
      required: true,
    },
    divided: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    client: {
      type: Mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Stakeholders',
    },
    employee: {
      type: Mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Stakeholders',
    },
    comments: {
      type: String,
      required: false,
    },
    products: [
      {
        product: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: 'Products',
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
      },
    ],
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    // financeId: {
    //   type: Mongoose.Schema.Types.ObjectId,
    //   required: false,
    //   ref: 'Finances',
    // },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

SalesSchema.plugin(MongooseUniqueValidator);

export default Mongoose.model('Sales', SalesSchema);
