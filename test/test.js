const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('../database');
const app = require('../main');
const { expect } = chai;
chai.use(chaiHttp);

let token;

describe('Users route', () => {
  const register = '/auth/register';
  const login = '/auth/login';
  const modifierprofil = 'auth/modifierprofil';
  const deleteprofil = 'auth/deleteprofil';
  const monprofil = '/auth/monprofil';

  
  const user = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const preSave = {
    email: 'gayegaye@gmail.com',
    password: faker.internet.password(),
  };
 
  

  // after all test have run we drop our test database
  /*after('droping test db', async () => {
    await mongoose.connection.dropDatabase(() => {
      console.log('\n Test database dropped');
    });
    await mongoose.connection.close();
  });*/
   
  describe('register', () => {
    it('should create new user if email not found', async () => {
      try {
        const result = await chai
          .request(app)
          .post(register)
          .send(preSave);
          expect(result.status).to.equal(200);
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
          .send(preSave);
      } catch (error) {
        throw new Error(error);
      }
    });
  });

  describe('login', () => {
    it('should return error 404 if user email and password empty', async () => {
      try {
        const result = await chai
          .request(app)
          .post(login)
          .send(user);
      } catch (error) {
      throw new Error(error);     
   }
    });

    it('should return 200 and our token', async () => {
      try {
        const result = await chai
          .request(app)
          .post(login)
          .send(user);
        expect(result.status).to.be.equal(200);
        expect(result.body).not.to.be.empty;
      } catch (error) {
        console.log(error);
      }
    });
  });
  describe('modifierprofil', () => {
    it('should return error 200 if user edited', async () => {
      try {
        const result = await chai
          .request(app)
          .post(modifierprofil)
          .send(user);
      } catch (error) {
        console.log(error);
    }
    });

    it('should return 400  if user was not updated', async () => {
      try {
        const result = await chai
          .request(app)
          .post(modifierprofil)
      } catch (error) {
        console.log(error)    
      }
    });
  });
  describe('delete', () => {
    it('should return error 200 if user deleted', async () => {
      try {
        const result = await chai
          .request(app)
          .delete(deleteprofil)
          .end((err, res) => {
            if(err) done(err);
            expect(res).should.have.status(200);
          })
          } catch (error) {
        console.log(error);
      }
    });

    it('should return 404  if error', async () => {
      try {
        const result = await chai
          .request(app)
          .delete(deleteprofil)
            expect(res).should.have.status(404);
          } catch (error) {
            console.log(error);
          }
    });
  });
    describe('GET /auth/monprofil/', () =>{
      it('should return a user',async ()=> {
    try {
      const result = await chai
        .request(app)
        .get(monprofil)
      expect(result.status).to.be.equal(200);
    } catch (error) {
      console.log(error);
    }

});
});
});