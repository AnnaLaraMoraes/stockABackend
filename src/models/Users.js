import Mongoose from 'mongoose';
import MongooseUniqueValidator from 'mongoose-unique-validator';

const UsersSchema = new Mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    isActive: { type: Boolean, required: true, default: true },
    isLegalPerson: { type: Boolean },
    name: { type: String },
    cpf: { type: String, required: false },
    cnpj: { type: String, required: false },
    storeName: { type: String },
    merchantType: {
      type: String,
      enum: ['autonomous', 'wholesaler', 'retailer', 'retailer-wholesaler'],
    },
    phone: { type: String },
    address: {
      state: { type: String },
      city: { type: String },
      address: { type: String },
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
    firebaseUid: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UsersSchema.plugin(MongooseUniqueValidator);

export default Mongoose.model('Users', UsersSchema);
