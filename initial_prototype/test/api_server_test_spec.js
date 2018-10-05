'use strict';

const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const Memstore = require('../components/store/memory_store');
const ApiServer = require('../components/server/api_server');
const ConversationRepo = require('../components/repo/conversation_repo');
const UserRepo = require('../components/repo/user_repo');

describe("test api server", function () {
    let request;

    before(() => {
        chai.use(chaiHttp);
        let store = new Memstore();
        let convRepo = new ConversationRepo(store);
        let userRepo = new UserRepo(store);
        let server = new ApiServer(convRepo, userRepo);
        server.start(5000);
        request = chai.request(server.app);
    });

    describe("/users routes", function () {
        it("tes routes", (done) => {
            request.get('/')
                .end((err, res) => {
                    assert.equal(res.text, {message: "Hi, jude!"});
                    done();
                });
        });

        it("get all users when user is 0", (done) => {
            request.get('/users?page=1&limit=5')
                .end((err, res) => {
                    assert.deepEqual(res.body, {
                        status_code: 200,
                        message: "success get users ",
                        results: [
                        {
                            data : "no data found"
                        }
                        ]
                        });
                    done();
                });
        });

        it("get user by id when no user with that id", (done) => {
            request.get('/users/1')
                .end((err, res) => {
                    assert.equal(res.body, {
                        status_code: 200,
                        message: "success get users 1",
                        results: [
                        {
                            data : "no data found"
                        }
                        ]
                        });
                    done();
                });
        });

        it("delete user by id when no user with that id", (done) => {
            request.delete('/users/1')
                .end((err, res) => {
                    assert.equal(res.body, {status_code : 201,
                        message : "success delete users by id 1",
                        results : []});
                    done();
                });
        });

        it("insert one sample user", (done) => {
            let data = {
                "name": "Rizal",
                "gender": "male",
                "city": "Malang",
                "phone": "08188100111",
                "email": "rizal@mail.com",
            };

            let expectedOutput = {
                "name": "Rizal",
                "gender": "male",
                "city": "Malang",
                "phone": "08188100111",
                "email": "rizal@mail.com",
                "id": 1
            };

            request.post('/users').send(data)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("get user by id", (done) => {
            let expectedOutput = {
                "name": "Rizal",
                "gender": "male",
                "city": "Malang",
                "phone": "08188100111",
                "email": "rizal@mail.com",
                "id": 1
            };

            request.get('/users/1')
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });

        it("update user by id", (done) => {
            let data = {
                "name": "Rizal Einstein",
                "city": "Jakarta",
            };

            let expectedOutput = {
                "name": "Rizal Einstein",
                "gender": "male",
                "city": "Jakarta",
                "phone": "08188100111",
                "email": "rizal@mail.com",
                "id": 1
            };

            request.put('/users/1').send(data)
                .end((err, res) => {
                    assert.deepEqual(res.body, expectedOutput);
                    done();
                });
        });
    });
});