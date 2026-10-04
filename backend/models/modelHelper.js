const mongoose = require('mongoose');

/**
 * Creates a hybrid model that routes database operations to Mongoose
 * when connected to MongoDB Atlas, or falls back to the embedded store
 * when running offline without a MONGO_URI configured.
 */
function createHybridModel(mongoModel, storeModel) {
  return new Proxy(mongoModel, {
    get(target, prop, receiver) {
      if (mongoose.connection.readyState === 1) {
        const val = Reflect.get(target, prop, receiver);
        return typeof val === 'function' ? val.bind(target) : val;
      }
      const val = Reflect.get(storeModel, prop, receiver);
      return typeof val === 'function' ? val.bind(storeModel) : val;
    },
    apply(target, thisArg, argumentsList) {
      if (mongoose.connection.readyState === 1) {
        return Reflect.apply(target, thisArg, argumentsList);
      }
      return Reflect.apply(storeModel, thisArg, argumentsList);
    },
    construct(target, argumentsList, newTarget) {
      if (mongoose.connection.readyState === 1) {
        return Reflect.construct(target, argumentsList, newTarget);
      }
      // Offline fallback: create document in store
      return storeModel.create ? storeModel.create(argumentsList[0]) : argumentsList[0];
    },
  });
}

module.exports = { createHybridModel };
