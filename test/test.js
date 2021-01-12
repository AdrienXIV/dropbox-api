const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('../database');
const app = require('../main');

const { expect } = chai;


chai.use(chaiHttp);
let token;
describe('auth route', () => {
  const register = '/auth/register';
  const login = '/auth/login';
  const deleteprofil = 'auth/deleteprofil';
  const modifierprofil = 'auth/modifierprofil';
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const preSave = {
    email: 'adrien.imie@gmail.com',
    password: faker.internet.password(),
  };

 /*before(async (done) => {
    const result = await chai
      .request(app)
      .post(register)
      .send(preSave);
        expect(result.status).to.equal(201);
        token = result.body.token;
        done();
  });
*/
  // after all test have run we drop our test database
 /* after('droping test db', async () => {
    await mongoose.connection.dropDatabase(() => {
      console.log('\n Test database dropped');
    });
    await mongoose.connection.close();
  });*/

  describe('register', () => {
    it('should crete new user if email not found', async () => {
      try {
        const result = await chai
          .request(app)
          .post(register)
          .send({email: 'adrien.imie@gmail.com',password: 'Wxcv!1234'});
        expect(result.status).to.equal(201);
        expect(result.body).not.to.be.empty;
        expect(result.body).to.have.property('token');
      } catch (error) {
        console.log(error);
      }
    });

    it('should return 400 if email was found', async () => {
      try {
        await chai
          .request(app)
          .post(register)
          .send({email: 'adrien.imie@gmail.com',password: 'Wxcv!1234'});
      } catch (error) {
        expect(error.status).to.equal(400);
        expect(error.response.text).to.equal('{ "error": "Utilisateur déjà existant"}');
      }
    });
  });

 /*  describe('secrete', () => {
    it('should return status 401', async () => {
      try {
        await chai.request(server).get(secret);
      } catch (error) {
        expect(error.status).to.equal(401);
        expect(error.response.text).to.equal('Unauthorized');
      }
    });

   it('should return status 200', async () => {
      try {
        const result = await chai
          .request(app)
          .get(secret)
          .set('Authorization', token);

        expect(result.status).to.equal(200);
        expect(result.body).to.deep.equal({ secret: 'resource' });
      } catch (error) {
        throw new Error(error);
      }
    });
  });*/

  describe('login', () => {
    it('should return error 404 if user email and password empty', async () => {
      let user = {};
      try {
        const result = await chai
          .request(app)
          .post(login)
          .send({email: 'adrien.imie@gmail.com',password: 'Wxcv!1234'});
      } catch (error) {
        expect(error.status).to.be.equal(404);
        expect(error.response.text).to.equal('{ "error": "L\'utilisateur n\'existe pas"}');
      }
    });

    it('should return 200 and our token', async () => {
      try {
        const result = await chai
          .request(server)
          .post(login)
          .send({email: 'adrien.imie@gmail.com',password: 'Wxcv!1234'});

        expect(result.status).to.be.equal(200);
        expect(result.body).not.to.be.empty;
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe('delete', () => {
    it('should return error 200 if user deleted', async () => {
      let user = {};
      try {
        const result = await chai
          .request(app)
          .delete(deleteprofil)
      } catch (error) {
        console.log(error);
      }
    });

    it('should return 400  if error', async () => {
      try {
        const result = await chai
          .request(server)
          .delete(deleteprofil)      
      } catch (error) {
        expect(error.status).to.equal(400);
       }
    });
  });

  describe('modifierprofil', () => {
    it('should return 200 if user edited', async () => {
      let user = {};
      try {
        const result = await chai
          .request(app)
          .post(modifierprofil)
          .send({email: 'adrien.imie@gmail.com', password: 'Wxkj!1234'});
      } catch (error) {
        console.log(error);
    }
    });

    it('should return 400  if user was not updated', async () => {
      try {
        const result = await chai
          .request(server)
          .post(modifierprofil)
          .send({password: 'Wxkj!1234'});
      } catch (error) {
        expect(error.status).to.equals(error);
      }
    });
  });
  
});
describe('User', () =>{
    describe('GET /auth/monprofil/', () =>{
      it('should return a user', (done)=> {
          chai
          .request(app)
          .get('/auth/monprofil/')
          .end((err,res)=>{
              if(err) done(err);
              expect(res).to.have.status(200);
              done();
          })
      });
    });
  });


