import * as yup from 'yup';
import Stakeholders from '../models/Stakeholders';

class StakeholdersController {
  async store(req, res) {
    const stakeholderSchema = yup.object({
      name: yup.string().required('Este campo é obrigatório'),
      phone: yup.string(),
      isLegalPerson: yup.string(),
      cpf: yup.string(),
      cnpj: yup.string(),
      email: yup.string(),
      socialNetwork: yup.string(),
      comments: yup.string(),
      type: yup.string().required('Este campo é obrigatório'),
      address: yup.object({
        state: yup.string(),
        city: yup.string(),
        address: yup.string(),
        cep: yup.string(),
      }),
      firebaseUserUid: yup.string().required('Este campo é obrigatório'),
    });

    let stakeholderValidated;

    try {
      req.body.firebaseUserUid = req.headers.firebaseuid;

      stakeholderValidated = await stakeholderSchema.validate(req.body, {
        abortEarly: true,
      });

      const newUser = new Stakeholders(stakeholderValidated);

      await newUser.save();

      return res
        .status(201)
        .json({ message: 'Pessoa cadastrado com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(422).json({ message: 'Erro ao cadastrar pessoa!' });
    }
  }

  async update(req, res, next) {
    const { id } = req.params;

    try {
      const user = await Stakeholders.findById(id);

      if (!user) {
        return res.status(422).json({ message: 'Nenhuma pessoa encontrada' });
      }

      await user.updateOne(req.body);

      return res.status(201).json({ message: 'Pessoa editada com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao editar pessoa!' });
    }
  }

  async index(req, res) {
    try {
      const { type } = req.query;

      let stakeholders;

      const { firebaseuid } = req.headers;

      if (type) {
        stakeholders = await Stakeholders.find({
          type: { $eq: type },
          firebaseUserUid: { $eq: firebaseuid },
        });
      } else {
        stakeholders = await Stakeholders.find({
          firebaseUserUid: { $eq: firebaseuid },
        });
      }
      return res.status(201).json({
        message: 'pessoas encontradas com sucesso!',
        data: stakeholders,
      });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao buscar pessoas!' });
    }
  }

  // async destroy(req, res, next) {
  //   const { id } = req.params;

  //   try {
  //     await Stakeholders.deleteOne({ _id: Mongoose.Types.ObjectId(id) });

  //     return res.status(201).json({ message: 'Pessoa excluído com sucesso!' });
  //   } catch (error) {
  //     return res.status(422).json({ message: 'Erro ao excluir pessoa!' });
  //   }
  // }
}

export default new StakeholdersController();
