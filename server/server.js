const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const port = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(
  cors(),
  express.json(),
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
  })
);
//Get the schema.graphql path
const schemaPath = path.join(__dirname, '.', 'schema.graphql');

//Read the file
const typeDefs = gql(fs.readFileSync(schemaPath, { encoding: 'utf8' }));

//import the resolver object
const resolvers = require('./resolvers');

// console.log(resolvers) = {Query:{...}, Job:{...}}


const context = (context) => {
  return {
    user: context.req.user,
  };
};

const apolloServer = new ApolloServer({ typeDefs, resolvers, context });

//Apply the app middleware to the apolloServer
apolloServer.applyMiddleware({ app, path: '/graphql' });

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret);
  res.send({ token });
});

app.listen(port, () => console.info(`Server started on port ${port}`));
