let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);

const expect = require('chai').expect
const server = require('../index');

/*
describe('test', () => {
  it('should return a string', () => {
    expect('Welcome to My API for Andela Bootcamp Cycle 45.').to.equal('Welcome to My API for Andela Bootcamp Cycle 45.');
  });
});

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});


it('should validate token GET', function(done) {
  chai.request(server)
    .get('/api/v1/token/validate')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
});

it('should get user info without using token  /api/v1/user/info/notoken <id> GET', function(done) {
  chai.request(server)
    .get('/api/v1/user/info/notoken?id=2')
    .send({'id': '2'})
    .end(function(err, res){
      res.should.be.json;
      res.body.should.be.a('object');
      done();
    });
});
*/

/*
it('should get signin user /api/v1/auth/signin POST', function(done) {
  chai.request(server)
    .post('/api/v1/auth/signin')
     .set('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IiQyYiQxMCRhZFpXZkRmNndJcDZtSk03LllqaXN1Q0dQYkxQLjcyeHZhLm83MDVnQjZvQURLdEN4N3lGbSIsImlhdCI6MTU2MDI5NzI0NSwiZXhwIjoxNTYwMzgzNjQ1fQ.UjzSHKeF3DgcS6AeKRVpuRmBa6VjOWdFR4NBh_2BGPc')
    .send({'email': 'greendublin007@gmail.com','password': 'qwerty'})
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      done();
    });
});


it('should signup user /api/v1/auth/signup POST', function(done) {
  chai.request(server)
    .post('/api/v1/auth/signup')
    .send({'email': 'greendublin007@gmail.com','first_name': 'bernard','last_name': 'dublin-green','last_name': 'qwerty','address': 'lagos'})
    .end(function(err, res){
      res.body.should.be.a('object');
      done();
    });
});
*/

it('should validate token  /api/v1/token/validate POST', function(done) {
  chai.request(server)
    .post('/api/v1/token/validate')
	 .set('token', 'wrongtoken')
    .send({})
    .end(function(err, res){
		res.should.have.status(200);	
		res.body.should.be.a('object');
		res.should.be.json;
		done();
    });
});

it('should validate token  /api/v1/token/validate GET', function(done) {
  chai.request(server)
    .get('/api/v1/token/validate?token=wrongtoken')
    .send({})
    .end(function(err, res){
		res.should.have.status(200);	
		res.should.be.json;
		res.body.should.be.a('object');
		done();
    });
});

it('should init user password recovery process /api/v1/user/password/recovery POST', function(done) {
  chai.request(server)
    .post('/api/v1/user/password/recovery')
    .send({"email" : "greendublin007@gmail.com"})
    .end(function(err, res){
		res.should.have.status(200);	
		res.should.be.json;
		res.body.should.be.a('object');
		done();
    });
});

it('should get user info, need to pass token with headers /api/v1/user/info POST', function(done) {
  chai.request(server)
    .post('/api/v1/user/info')
    .set('token', 'wrongtoken')
    .send({"id" : 1})
    .end(function(err, res){
		res.should.have.status(200);	
		res.should.be.json;
		res.body.should.be.a('object');
		done();
    });
});

it('should get user info, no token needed/api/v1/user/info/notoken GET', function(done) {
  chai.request(server)
    .get('/api/v1/user/info/notoken?id=1')
    .send({})
    .end(function(err, res){
		res.should.have.status(200);	
		res.should.be.json;
		res.body.should.be.a('object');
		done();
    });
});

it('should get car info, no token needed /api/v1/user/car/info/notoken GET', function(done) {
  chai.request(server)
    .get('/api/v1/user/car/info/notoken?id=1')
    .send({})
    .end(function(err, res){
		res.should.have.status(200);	
		res.should.be.json;
		res.body.should.be.a('object');
		done();
    });
});

it('should register a new user , /api/v1/auth/signup POST', function(done) {
  chai.request(server)
    .post('/api/v1/auth/signup')
    .send({"email" : "greendublin007@gmail.com","first_name" : "idisimagha","last_name" : "dublin-green","password" : "qwerty","address" : "badore ajah lekki lagos Nigeria"})
    .end(function(err, res){
		res.should.have.status(200);	
		res.should.be.json;
		res.body.should.be.a('object');
		done();
    });
});
