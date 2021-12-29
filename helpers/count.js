const getModelCount = (model) => {
  return async (req, res) => {
    try {
      const modelCount = await model.countDocuments();
      if (!modelCount) throw new Error({ success: false });
      console.log(modelCount);
      res.status(200).send({ count: modelCount });
    } catch (err) {
      res.status(500).json(err);
    }
  };
};

module.exports = {
  getModelCount,
};
