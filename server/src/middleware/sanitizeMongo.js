// sanitize Mongo

const sanitizeMongo = (req, res, next) => {
  const clean = (obj) => {
    for (let key in obj) {
      if (/^\$/.test(key)) {
        delete obj[key]; // remove keys starting with $
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]); // recurse
      }
    }
  };

  clean(req.body);
  clean(req.query);
  clean(req.params);

  next();
};

export default sanitizeMongo;
