import Categories from '../models/Categories';

class CategoriesController {
  async show(req, res) {
    try {
      const categories = await Categories.find();
      return res.status(201).json({
        message: 'Categorias encontradas com sucesso',
        data: categories,
      });
    } catch (error) {
      return res.status(422).json({ message: 'Erro ao buscar categorias!' });
    }
  }
}

export default new CategoriesController();
