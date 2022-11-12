const { UserInputError } = require('apollo-server');

//https://www.youtube.com/watch?v=YPKH6OhEHFI
//https://github.com/hidjou/classsed-graphql-mern-apollo/blob/class2/graphql/resolvers/users.js

const {  userService, tokenService, authService } = require('../../services');

module.exports = {
  Mutation: {
    async login(_,
        {
          loginInput: {  email, password }
        }
      ) {
      const user = await authService.loginUserWithEmailAndPassword(email, password);
      const tokens = await tokenService.generateAuthTokens(user);
      return {
        user,
        tokens
      };
    },
    async register(
      _,
      {
        registerInput: { name, email, password }
      }
    ) {
      const registerInput = { name, email, password }
      const user = await userService.createUser(registerInput);
      const tokens = await tokenService.generateAuthTokens(user);

      return {
        user,
        tokens
      };
    }
  }
};
