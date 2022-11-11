const { UserInputError } = require('apollo-server');
//https://www.youtube.com/watch?v=YPKH6OhEHFI
const validate = require('../../validations/index');
const authValidation = require('../../validations/auth.validation');
const { authService, userService, tokenService, emailService } = require('../../services');

module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    async register(
      _,
      {
        registerInput: { name, email, password }
      }
    ) {
      const registerInput = { name, email, password }
       // validate(authValidation.register);
      const user = await userService.createUser(registerInput);
      const tokens = await tokenService.generateAuthTokens(user);

      return {
        user,
        tokens
      };
    }
  }
};
