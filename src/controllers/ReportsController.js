/* eslint-disable prettier/prettier */
import Sales from '../models/Sales';

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

        return {
          _id: sale._id,
          client: sale.client.name,
          totalValue: Number(sale.totalValue),
          date: sale.date,
          toReceived,
          totalReceived: totalValuePaid,
          received: sale.received,
        };
      });

      const salesData = {
        saleFomated,
        totalToReceived,
        totalReceived,
        totalSale,
      };

      return res
        .status(201)
        .json({ message: 'Produto editado com sucesso!', salesData });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao buscar categorias!' });
    }
  }
}

export default new ReportsController();
