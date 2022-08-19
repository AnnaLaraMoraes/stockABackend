import * as yup from 'yup';
import Categories from '../models/Categories';

class CategoriesController {
  async show(req, res) {
    try {
      const { firebaseuid } = req.headers;

      const categories = await Categories.find({
        $or: [
          { firebaseUserUid: { $eq: firebaseuid } },
          { public: { $eq: true } },
        ],
      });

      return res.status(201).json({
        message: 'Categorias encontradas com sucesso',
        data: categories,
      });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao buscar categorias!' });
    }
  }

  async store(req, res) {
    const categorySchema = yup.object({
      name: yup.string().required('Este campo é obrigatório'),
      label: yup.string().required('Este campo é obrigatório'),
      productType: yup.string().required('Este campo é obrigatório'),
      firebaseUserUid: yup.string(),
    });

    let categoryValidated;

    try {
      req.body.firebaseUserUid = req.headers.firebaseuid;

      categoryValidated = await categorySchema.validate(req.body, {
        abortEarly: true,
      });

      const newCategory = new Categories(categoryValidated);

      await newCategory.save();

      return res
        .status(201)
        .json({ message: 'Categoria cadastrada com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao cadastrar categoria!' });
    }
  }
}

export default new CategoriesController();
