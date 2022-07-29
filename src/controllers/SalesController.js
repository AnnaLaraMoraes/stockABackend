import * as yup from 'yup';
import Mongoose from 'mongoose';
import Sales from '../models/Sales';
import Users from '../models/Users';
import Products from '../models/Products';

class SalesController {
  async store(req, res) {
    console.log('entrou aqui em cadastrar');
    const saleSchema = yup.object({
      paymentType: yup
        .string()
        .required('Este campo é obrigatório')
        .test(
          'is-valid',
          'is not valid',
          (value) => value === 'cash' || value === 'creditCard'
        ),
      divided: yup.string(),
      date: yup.string().required('Este campo é obrigatório'),
      client: yup.string(),
      employee: yup.string(),
      comments: yup.string(),
      products: yup
        .array()
        .of(
          yup.object().shape({
            product: yup.string(),
            amount: yup.string(),
            value: yup.string(),
          })
        )
        .required('Este campo é obrigatório'),
      userId: yup
        .string()
        .required('Este campo é obrigatório')
        .test('is-user', 'Usuário não encontrado.', async (id) =>
          Users.findById(id)
        ),
      totalValue: yup.string().required('Este campo é obrigatório'),
    });
    try {
      const { products } = req.body;

      const saleValidated = await saleSchema.validate(req.body, {
        abortEarly: true,
      });
      const newSale = new Sales(saleValidated);
      await newSale.save();

      await newSale.save();

      products.map(async (product) => {
        await Products.updateOne(
          { _id: Mongoose.Types.ObjectId(product.product) },
          { $inc: { amountStock: Number(product.amount) * -1 } }
        );
        return product;
      });

      return res.status(201).json({ message: 'Venda cadastrado com sucesso!' });
    } catch (error) {
      console.log(error);
      return res.status(422).json({ message: 'Erro ao cadastrar venda' });
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    try {
      const sale = await Sales.findById(id);

      if (!sale) {
        return res.status(422).json({ message: 'Nenhuma venda encontrada' });
      }

      await sale.updateOne(req.body);

      const updateProduct = async (idProduct, lastValue, newValue) => {
        const product = await Products.findOne({
          _id: Mongoose.Types.ObjectId(idProduct),
        });
        if (!product) {
          res.status(422).json({ message: 'Erro ao editar produto!' });
        }
        const newStock =
          Number(product.amountStock) + Number(lastValue) - Number(newValue);

        await Products.updateOne(
          { _id: Mongoose.Types.ObjectId(idProduct) },
          { amountStock: newStock }
        );
      };

      const addNewProductToSale = async (idProduct, newAmount) => {
        await Products.updateOne(
          { _id: Mongoose.Types.ObjectId(idProduct) },
          { $inc: { amountStock: Number(newAmount) * -1 } }
        );
      };

      const deleteProductFromSale = async (
        idProduct,
        amountToReturnToStock
      ) => {
        const product = await Products.findOne({
          _id: Mongoose.Types.ObjectId(idProduct),
        });

        if (!product) {
          res.status(422).json({ message: 'Erro ao editar produto!' });
        }
        const newStock =
          Number(product.amountStock) + Number(amountToReturnToStock);

        await Products.updateOne(
          { _id: Mongoose.Types.ObjectId(idProduct) },
          { amountStock: newStock }
        );
      };

      const { productsToRemove } = req.body;

      if (productsToRemove && productsToRemove.length > 0) {
        productsToRemove.map((dataProductsToRemove) =>
          deleteProductFromSale(
            dataProductsToRemove.id,
            dataProductsToRemove.amount
          )
        );
      }

      const { products } = req.body;

      if (products && products.length > 0) {
        products.map((productToEdit) => {
          if (productToEdit.lastData && productToEdit.lastData !== '') {
            updateProduct(
              productToEdit.product,
              productToEdit.lastData.amount,
              productToEdit.amount
            );
          } else {
            addNewProductToSale(productToEdit.product, productToEdit.amount);
          }
          return productToEdit;
        });
      }

      return res.status(201).json({ message: 'Venda editada com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao editar produto!' });
    }
  }

  async index(req, res) {
    try {
      // const { userId } = req.query;
      const sales = await Sales.find()
        .populate('client')
        .populate({
          path: 'products',
          populate: {
            path: 'product',
            populate: {
              path: 'category',
            },
          },
        });
      return res
        .status(201)
        .json({ message: 'Vendas encontrados com sucesso!', sales });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao buscar Vendas' });
    }
  }

  async destroy(req, res, next) {
    const { id } = req.params;

    const deleteProductFromSale = async (idProduct, amountToReturnToStock) => {
      const product = await Products.findOne({
        _id: Mongoose.Types.ObjectId(idProduct),
      });

      if (!product) {
        res.status(422).json({ message: 'Erro ao editar produto!' });
      }
      const newStock =
        Number(product.amountStock || 0) + Number(amountToReturnToStock);

      await Products.updateOne(
        { _id: Mongoose.Types.ObjectId(idProduct) },
        { amountStock: newStock }
      );
    };

    try {
      const sale = await Sales.findOne({
        _id: Mongoose.Types.ObjectId(id),
      });

      if (sale && sale.products && sale.products.length > 0) {
        sale.products.map((dataproducts) =>
          deleteProductFromSale(dataproducts.product, dataproducts.amount)
        );
      }

      await Sales.deleteOne({ _id: Mongoose.Types.ObjectId(id) });

      return res.status(201).json({ message: 'Venda exclído com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao excluir venda!' });
    }
  }

  async updatePayment(req, res, next) {
    const { id } = req.params;
    const { received } = req.body;
    try {
      const sale = await Sales.findOne({
        _id: Mongoose.Types.ObjectId(id),
      });

      await sale.updateOne({ $push: { received } });

      return res
        .status(201)
        .json({ message: 'Pagamento adicionado com sucesso!' });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao adicionar pagamento!' });
    }
  }
}

export default new SalesController();
