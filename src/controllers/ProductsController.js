import * as yup from 'yup';
import Mongoose from 'mongoose';
import Product from '../models/Products';
import Categories from '../models/Categories';

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
      subcategory: yup.string(),
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
            value === 'clothes' ||
            value === 'shoes' ||
            value === 'accessories' ||
            value === 'others'
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
      firebaseUserUid: yup.string().required('Este campo é obrigatório'),
    });

    try {
      req.body.firebaseUserUid = req.headers.firebaseuid;
      const productValidated = await productSchema.validate(req.body, {
        abortEarly: true,
      });

      const newproduct = new Product(productValidated);
      await newproduct.save();

      return res
        .status(201)
        .json({ message: 'Produto cadastrado com sucesso!' });
    } catch (error) {
      console.log(error);
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
      console.log('Erro ao editar produto:', error);
      return res.status(422).json({ message: 'Erro ao editar produto!' });
    }
  }

  async destroy(req, res, next) {
    const { id } = req.params;

    try {
      await Product.deleteOne({ _id: Mongoose.Types.ObjectId(id) });

      return res.status(201).json({ message: 'Produto excluído com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao excluir produto!' });
    }
  }

  async index(req, res) {
    try {
      const { firebaseuid } = req.headers;

      const products = await Product.find({
        firebaseUserUid: { $eq: firebaseuid },
      })
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
