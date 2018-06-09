exports.clean = (models) => {
  const deleteDocs = model => {
    return new Promise((resolve, reject) => {
      model.remove({}, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  };

  const promises = models.reduce((result, model) => {
    result.push(deleteDocs(model));
    return result;
  }, []);

  return Promise.all(promises);
}