module.exports.keytoken = (req, res, callback) => {
  
    if (req.headers) {
      if (req.headers.authorization) {
        let t = req.headers.authorization;
        if (t == process.env.KEYTOKEN) {
                  callback();
          }else{
          return res.status(401).json({ message: "Authorization failed" });
          }
          }
         else {
          return res.status(401).json({ message: "Authorization failed" });
        }
      } else {
        return res.status(401).json({ message: "Account is locked" });
      }
};
