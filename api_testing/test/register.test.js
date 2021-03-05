const chai = require('chai');
const mocha = require('mocha');
const describe = mocha.describe;
const chaiHttp = require('chai-http');
const expect = chai.expect;
const baseUrl = "http://localhost:3000";

chai.use(chaiHttp);

describe('regiser', function() {

  it ('should register new users', () => {
    chai.request("http://localhost:3000")
    .post('/register')
    .type('form')
    .send({
      '_method': 'post',
      'name': "Frank",
      'password': 'charlie'
    })
    .end(function (err, res) {
      expect(res).to.have.cookie('session');
    })
  })

  it ('should reject registration if the username is taken', () => {
    chai.request("http://localhost:3000")
    .post('/register')
    .type('form')
    .send({
      '_method': 'post',
      'name': "test",
      'password': 'testing'
    })
    .end(function (err, res) {
      expect(res.text).to.contain('Error');
    })
  })
})

it ('should reject users who leave fields blank', () => {
  chai.request("http://localhost:3000")
  .post('/register')
  .type('form')
  .send({
    '_method': 'post',
    'name': "empty",
    "password": ""
  })
  .end(function (err, res) {
    expect(res.text).to.contain("fields cannot be left blank");
  })
})