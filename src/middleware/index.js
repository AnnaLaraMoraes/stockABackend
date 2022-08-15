import admin from '../config/firebase-config';

class Middleware {
  async decodeToken(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      // decodeValue.uid
      if (decodeValue) {
        return next();
      }

      return res.json({ message: 'Un auth' });
    } catch (error) {
      return res.json({ message: 'Internal error' });
    }
  }
}

export default new Middleware();
