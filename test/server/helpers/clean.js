module.exports = model => {
  return new Promise((resolve, reject) => {
    model.remove({}, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
};