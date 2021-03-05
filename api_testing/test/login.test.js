const chai = require('chai');
const mocha = require('mocha');
const describe = mocha.describe;
const chaiHttp = require('chai-http');
const expect = chai.expect;
const baseUrl = "http://localhost:3000";

chai.use(chaiHttp);

describe('login', function(){

  it ('should access the home page', () => {
    chai.request("http://localhost:3000")
    .get('/home')
    .end(function (err, res) {
      expect(res).to.have.status(200);
      done();
    });
  })


})