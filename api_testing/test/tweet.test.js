const chai = require('chai');
const mocha = require('mocha');
const describe = mocha.describe;
const chaiHttp = require('chai-http');
const expect = chai.expect;
const baseUrl = "http://localhost:3000";
const agent = chai.request.agent("http://localhost:3000");

chai.use(chaiHttp);

describe('tweet', function() {
  it('should attach the users id to the tweet', () => {
    chai.request("http://localhost:3000")
    .post('/login')
    .type('form')
    .send({
      '_method': 'post',
      'name': 'testing',
      'password': 'test'
    })
    .then(function (res) {
      expect(res).to.have.cookie('session');
      return agent.get('/user/testing')
      .then(function (res) {
        console.log(res);
        expect(res).to.have.status(200);
        done();
      })
    })
  })
  it('should post tweets and save them to database', () => {
    chai.request("http://localhost:3000")
    .post('/tweets')
    .type('form')
    .send({ 'content':'a testing tweet', 'user': 'test' })
    .end(function (err, res) {
      expect(res).to.have.status(200);
    })
  })

  // it('should delete tweets, selected by id', () => {
  //   chai.request("http://localhost:3000")
  //   .delete(`/tweets/${8}`)
  //   .type('form')
  //   .send({ '_method': 'delete' , 'id': '8'})
  //   .end(function (err, res) {
  //     expect(res).to.have.status(200)
     
  //   })
  // })

  it ('should modify selected tweets', () => {
    chai.request("http://localhost:3000")
    .put(`/tweets/:id`)
    .type('form')
    .send({
      '_method': 'put',
      'content': 'a modified tweet',
      'id': '15'
    })
    .end(function (err, res) {
      expect(res).to.have.status(200);
    })
  })

  it('should display all posted tweets', () => {
    chai.request("http://localhost:3000")
    .get('/tweets')
    .end(function (err, res) {
      expect(res.text).to.contain(`tweet tweeting`)
    })
  })
})