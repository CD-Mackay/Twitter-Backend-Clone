const chai = require('chai');
const mocha = require('mocha');
const describe = mocha.describe;
const chaiHttp = require('chai-http');
const expect = chai.expect;
const baseUrl = "http://localhost:3000";

chai.use(chaiHttp);

describe('login', function(){

  it ('should login a user who exists within the database', () => {
    chai.request("http://localhost:3000")
    .post('/login')
    .type('form')
    .send({
      '_method': 'post',
      'name': 'testing',
      'password': 'test'
    })
    .end(function (err, res) {
      expect(res).to.have.status(200);
    })
  })

  it ('should reject users with incorrect passwords', () => {
    chai.request("http://localhost:3000")
    .post('/login')
    .type('form')
    .send({
      '_method': 'post',
      'name': 'testing',
      'password': 'testingpoorly'
    })
    .end(function (err, res) {
      expect(res).to.not.have.cookie('session');
    })
  })
})