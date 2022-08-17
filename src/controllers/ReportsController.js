/* eslint-disable prettier/prettier */
import Sales from '../models/Sales';
// import Product from '../models/Products';

class ReportsController {
  async index(req, res) {
    try {
      const { firebaseuid } = req.headers;

      const sales = await Sales.find({
        firebaseUserUid: { $eq: firebaseuid },
      })
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

      let totalToReceived = 0;
      let totalReceived = 0;
      let totalSale = 0;

      const saleFomated = sales.map((sale) => {
        const { totalValuePaid } = sale.received.reduce(
          (accumulator, receveidData) => {
            accumulator.totalValuePaid += Number(receveidData.value);

            return accumulator;
          },
          {
            totalValuePaid: 0,
          }
        );

        const toReceived = Number(sale.totalValue) - Number(totalValuePaid);

        totalToReceived += Number(toReceived);
        totalReceived += Number(totalValuePaid);
        totalSale += Number(sale.totalValue);

        const productsSale = sale.products.map((prod) => ({
          amount: prod.amount,
          clientSale: sale.client && sale.client.name ? sale.client.name : '',
          dateSale: sale.date,
          lucre: prod.product.costSale - prod.product.costValue,
          costSale: prod.product.costSale,
          costValue: prod.product.costValue,
          amountStock: prod.product.amountStock,
          category: prod.product.category.label,
          code: prod.product.code,
          description: prod.product.description,
        }));

        return {
          _id: sale._id,
          clientSale: sale.client && sale.client.name ? sale.client.name : '',
          totalValue: Number(sale.totalValue),
          date: sale.date,
          toReceived,
          totalReceived: totalValuePaid,
          received: sale.received,
          productsSale,
        };
      });

      const salesData = {
        saleFomated,
        totalToReceived,
        totalReceived,
        totalSale,
      };

      // const products = await Product.find({
      //   firebaseUserUid: { $eq: firebaseuid },
      // })
      //   .populate('provider')
      //   .populate('category');

      // const productsFormated = products.map((prod) => ({
      //   date: prod.date,
      //   lucre: prod.costSale - prod.costValue,
      //   costSale: prod.costSale,
      //   costValue: prod.costValue,
      //   amountStock: prod.amountStock,
      //   category: prod.category.label,
      //   code: prod.code,
      //   description: prod.description,
      // }));

      // const { totalLucre } = productsFormated.reduce(
      //   (accumulator, data) => {
      //     accumulator.totalLucre += Number(data.lucre);

      //     return accumulator;
      //   },
      //   {
      //     totalLucre: 0,
      //   }
      // );

      // const productsData = {
      //   productsFormated,
      //   totalLucre,
      // };

      return res.status(201).json({
        message: 'Relatórios buscados com sucesso!',
        salesData,
      });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao buscar relatórios!' });
    }
  }
}

export default new ReportsController();
