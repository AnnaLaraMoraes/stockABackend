import Mongoose from 'mongoose';
import MongooseUniqueValidator from 'mongoose-unique-validator';

const UsersSchema = new Mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isVerified: { type: Boolean, required: true, default: true },
    isLegalPerson: { type: Boolean, required: true },
    name: { type: String, required: true },
    cpf: { type: String, required: false },
    cnpj: { type: String, required: false },
    storeName: { type: String, required: true },
    merchantType: {
      type: String,
      enum: ['autonomous', 'wholesaler', 'retailer'],
      required: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      state: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    role: {
      type: String,
      enum: ['admin', 'merchant'],
      required: true,
      default: 'merchant',
    },
    status: {
      type: String,
      enum: ['debit', 'paid'],
      required: true,
      default: 'debit',
    },
  },
  { timestamps: true }
);

UsersSchema.plugin(MongooseUniqueValidator);

export default Mongoose.model('Users', UsersSchema);
