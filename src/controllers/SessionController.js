import User from '../models/Users';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    console.log(email, password);
  }
}

export default new SessionController();
