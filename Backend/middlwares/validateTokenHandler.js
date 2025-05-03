import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateToken = expressAsyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "Unauthorized!" });
      } else {
        req.user = decoded;
        next();
      }
    });

    if (!token) {
      res
        .status(401)
        .send({ message: "User is not authorized or token is Missing" });
    }
  } else {
    res.status(401).send({ message: "Unauthorized!" });
  }
});

export default validateToken;
