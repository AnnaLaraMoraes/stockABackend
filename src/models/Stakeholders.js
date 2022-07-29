import Mongoose from 'mongoose';
import MongooseUniqueValidator from 'mongoose-unique-validator';

const StakeholdersSchema = new Mongoose.Schema(
  {
    isActive: { type: Boolean, required: true, default: true },
    name: { type: String, required: true },
    phone: { type: String },
    address: {
      state: { type: String, required: false },
      city: { type: String, required: false },
      address: { type: String, required: false },
      cep: { type: String, required: false },
    },
    isLegalPerson: { type: Boolean },
    cpf: { type: String, required: false },
    cnpj: { type: String, required: false },
    email: { type: String, required: false },
    socialNetwork: { type: String, required: false },
    comments: { type: String, required: false },
    type: {
      type: String,
      enum: ['provider', 'employee', 'client'],
      required: true,
    },
    userId: {
      type: Mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  { timestamps: true }
);

StakeholdersSchema.plugin(MongooseUniqueValidator);

export default Mongoose.model('Stakeholders', StakeholdersSchema);
