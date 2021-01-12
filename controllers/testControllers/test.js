
// will work for linux for windows we are going to user cross-env in package json
//process.env.NODE_ENV = 'test';

const chai = require('chai');
const faker = require('faker');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const rewire = require('rewire');
const { expect } = chai;
const {generateTokenForUser} = rewire('../../utils/jwt.utils.js')
const User = require('../../../server/models/user');
const { register } = require('../user.controller');
const usersController = rewire('../user.controller.js');
chai.use(sinonChai);

let sandbox = null;
describe('Users controller', () => {
  let req = {
    user: {
      id: faker.random.number(),
    },
    value: {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    },
  };
  let res = {
    json: function() {
      return this;
    },
    status: function() {
      return this;
    },
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Login', () => {
    it('should return token when register called', async () => {
      sandbox.spy(res, 'json');
      sandbox.spy(res, 'status');

      try {
        await usersController.login(req, res);

        expect(res.status).to.have.been.calledWith(200);
        expect(res.json.callCount).to.equal(1);
      } catch (error) {
        throw new Error(error);
      }
    });

    it('should return fake token using rewire', async () => {
      sandbox.spy(res, 'json');
      sandbox.spy(res, 'status');

      // fake jwt token with rewire
      let signToken = usersController.__set__('signToken', user => 'fakeToken');

      try {
        await usersController.login(req, res);

        expect(res.json).to.have.been.calledWith({
          token: 'fakeToken',
        });
        signToken();
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('Register', () => {
    it('should return 400 if the user is already save in the db.', async () => {
      sandbox.spy(res, 'json');
      sandbox.spy(res, 'status');
      sandbox.stub(User, 'findOne').returns(
        Promise.resolve({
          id: faker.random.number(),
        }),
      );

      try {
        await register(req, res);

        expect(res.status).to.have.been.calledWith(400);
        expect(res.json).to.have.been.calledWith({
          error: 'Email is already in use',
        });
      } catch (error) {
        throw new Error(error);
      }
    });

    it('should return 201 if user is not in db and it was saved', async () => {
      sandbox.spy(res, 'json');
      sandbox.spy(res, 'status');
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false));
      sandbox.stub(User.prototype, 'save').returns(
        Promise.resolve({
          id: faker.random.number(),
        }),
      );

      try {
        await userController.register(req, res);

        expect(res.status).to.have.been.calledWith(201);
        expect(res.json.callCount).to.equal(1);
      } catch (error) {
        throw new Error(error);
      }
    });

    it('should return 201 if user is not in db using callback done', async () => {
      sandbox.spy(res, 'json');
      sandbox.spy(res, 'status');
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false));
      sandbox.stub(User.prototype, 'save').returns(
        Promise.resolve({
          id: faker.random.number(),
        }),
      );

      try {
        await userController.register(req, res);

        expect(res.status).to.have.been.calledWith(201);
        expect(res.json.callCount).to.equal(1);
      } catch (error) {
        throw new Error(error);
      }
    });

    it('should return fake token in res.json', async () => {
      sandbox.spy(res, 'json');
      sandbox.spy(res, 'status');
      sandbox.stub(User, 'findOne').returns(Promise.resolve(false));
      sandbox.stub(User.prototype, 'save').returns(
        Promise.resolve({
          id: faker.random.number(),
        }),
      );

      let signToken = userController.__set__('signToken', user => 'fakeTokenNumberTwo');

      try {
        await userController.register(req, res);

        expect(res.json).to.have.been.calledWith({
          token: 'fakeTokenNumberTwo',
        });
        signToken();
      } catch (error) {
        throw new Error(error);
      }
    });
  });
});