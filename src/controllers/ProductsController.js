import * as yup from 'yup';
import Mongoose from 'mongoose';
import Product from '../models/Products';
import Categories from '../models/Categories';
// import Stakeholders from '../models/Stakeholders';
import Users from '../models/Users';

class ProductsController {
  async store(req, res) {
    const productSchema = yup.object({
      date: yup.string().required('Este campo é obrigatório'),
      code: yup.string().required('Este campo é obrigatório'),
      category: yup
        .string()
        .required('Este campo é obrigatório')
        .test('is-category', 'Categoria não encontrado.', async (id) =>
          Categories.findById(id)
        ),
      subcategory: yup
        .string()
        .test(
          'is-valid',
          'is not valid',
          (value) =>
            value === 'female' ||
            value === 'male' ||
            value === 'boy' ||
            value === 'girl'
        )
        .required('Este campo é obrigatório'),
      amountStock: yup.string().required('Este campo é obrigatório'),
      size: yup.string(),
      costValue: yup.string().required('Este campo é obrigatório'),
      costSale: yup.string().required('Este campo é obrigatório'),
      productType: yup
        .string()
        .test(
          'is-valid',
          'is not valid',
          (value) =>
            value === 'clothes' || value === 'shoes' || value === 'accessories'
        )
        .required('Este campo é obrigatório'),
      provider: yup.string(),
      description: yup.string(),
      productStockType: yup
        .string()
        .test(
          'is-valid',
          'is not valid',
          (value) => value === 'wholesale' || value === 'retail'
        )
        .required('Este campo é obrigatório'),
      userId: yup
        .string()
        .required('Este campo é obrigatório')
        .test('is-user', 'Usuário não encontrado.', async (id) =>
          Users.findById(id)
        ),
    });

    try {
      const productValidated = await productSchema.validate(req.body, {
        abortEarly: true,
      });

      const newproduct = new Product(productValidated);
      await newproduct.save();

      return res
        .status(201)
        .json({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao cadastrar Produto ' });
    }
  }

  async update(req, res, next) {
    const { id } = req.params;

    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(422).json({ message: 'Nenhum produto encontrado' });
      }

      await product.updateOne(req.body);

      return res.status(201).json({ message: 'Produto editado com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao editar produto!' });
    }
  }

  async destroy(req, res, next) {
    const { id } = req.params;

    try {
      await Product.deleteOne({ _id: Mongoose.Types.ObjectId(id) });

      return res.status(201).json({ message: 'Produto exclído com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao excluir produto!' });
    }
  }

  async index(req, res) {
    try {
      // const { userId } = req.query;

      // const aggregatePipe = [
      //   {
      //     $lookup: {
      //       from: 'sales',
      //       localField: 'products',
      //       foreignField: '_id',
      //       as: 'productsSale',
      //     },
      //   },
      //   {
      //     $unwind: '$productsSale',
      //   },
      // ];

      // const products = await Product.aggregate(aggregatePipe);
      // // .populate('provider')
      // // .populate('category');

      const products = await Product.find()
        .populate('provider')
        .populate('category');

      return res
        .status(201)
        .json({ message: 'Produtos encontrados com sucesso!', products });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao buscar Produto ' });
    }
  }
}

export default new ProductsController();
