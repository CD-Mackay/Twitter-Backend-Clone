const chai = require('chai');
const mocha = require('mocha');
const describe = mocha.describe;
const chaiHttp = require('chai-http');
const expect = chai.expect;
const baseUrl = "http://localhost:3000";

chai.use(chaiHttp);

describe('tweet', function() {
  it('should post tweets and save them to database', () => {
    chai.request("http://localhost:3000")
    .post('/tweets')
    .type('form')
    .send({
      '_method': 'post',
      'author': 'req.session.user',
      'content':'a testing tweet'
    })
    .end(function (err, res) {
      console.log(res.text);
      expect(res.text).to.contain('Register');
    })
  })
})