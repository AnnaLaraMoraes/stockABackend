import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  /**
   * Establishes the connection with MongoDB.
   */
  async mongo() {
    this.mongoConnection = await mongoose.connect(process.env.MONGODB_URI, {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export default new Database();
