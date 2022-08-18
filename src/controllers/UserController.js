import * as yup from 'yup';
import User from '../models/Users';

class UserController {
  async store(req, res) {
    const userSchema = yup.object({
      email: yup
        .string()
        .required('Este campo é obrigatório')
        .email('Este email nao é válido'),
      isLegalPerson: yup.boolean(),
      name: yup.string(),
      cnpj: yup.string(),
      cpf: yup.string(),
      storeName: yup.string(),
      merchantType: yup.string(),
      phone: yup.string(),
      address: yup.object({
        state: yup.string(),
        city: yup.string(),
        address: yup.string(),
      }),
      firebaseUid: yup.string().required('Este campo é obrigatório'),
    });

    let userValidated;

    try {
      userValidated = await userSchema.validate(req.body, {
        abortEarly: true,
      });

      const { email } = userValidated;

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(500).json({ message: 'E-mail já cadastrado!' });
      }

      const newUser = new User(userValidated);
      await newUser.save();

      return res
        .status(201)
        .json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao cadastrar usuário!' });
    }
  }
}

export default new UserController();
