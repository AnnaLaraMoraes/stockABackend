import * as yup from 'yup';
import User from '../models/Users';
import { hashPassword } from '../utils/hash';
import { validateCnpj, validateCpf } from '../utils/validators';

class UserController {
  async store(req, res) {
    const userSchema = yup.object({
      email: yup
        .string()
        .required('Este campo é obrigatório')
        .email('Este email nao é válido'),
      isLegalPerson: yup.boolean().required('Este campo é obrigatório'),
      name: yup.string().required('Este campo é obrigatório'),
      cnpj: yup
        .string()
        .transform((cnpj) => cnpj.replace(/\D/g, ''))
        .when('isLegalPerson', (isLegalPerson, field) =>
          isLegalPerson
            ? field
                .required()
                .test('is-cnpj-valid', 'CNPJ inválido.', validateCnpj)
            : field.strip()
        ),
      cpf: yup
        .string()
        .transform((cpf) => (cpf ? cpf.replace(/\D/g, '') : ''))
        .when('isLegalPerson', (isLegalPerson, field) =>
          isLegalPerson
            ? field
            : field
                .required()
                .test('is-cpf-valid', 'CPF inválido.', validateCpf)
        ),
      storeName: yup.string().required('Este campo é obrigatório'),
      merchantType: yup.string().required('Este campo é obrigatório'),
      password: yup
        .string()
        .required('Este campo é obrigatório')
        .min(8, 'Senha muito curta'),
      phone: yup.string().required('Este campo é obrigatório'),
      address: yup.object({
        state: yup.string().required('Este campo é obrigatório'),
        city: yup.string().required('Este campo é obrigatório'),
        address: yup.string().required('Este campo é obrigatório'),
      }),
    });

    let userValidated;

    try {
      userValidated = await userSchema.validate(req.body, {
        abortEarly: true,
      });
    } catch (error) {
      console.log(error);

      return res.status(422).json({ message: 'Erro ao cadastrar usuário!' });
    }

    const { email, password } = userValidated;

    const filter = { email };

    const userExists = await User.findOne(filter);

    if (userExists) {
      return res.status(500).json({ message: 'E-mail já cadastrado!' });
    }

    const { hasError, hashedPassword } = await hashPassword(password);

    if (hasError) {
      return res.status(500).json({ message: 'Erro ao cadastrar usuário!' });
    }

    userValidated.password = hashedPassword;

    const newUser = new User(userValidated);
    await newUser.save();

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  }
}

export default new UserController();
