'use strict';

const express = require('express');
const bodyParser = require('body-parser');

class ApiServer{
    constructor(convRepo, userRepo) {
        this.convRepo = convRepo;
        this.userRepo = userRepo;
        this.app = express();
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({
            extended: false,
            limit: '10mb',
        }));
    }
    start(port){
        const convRepo = this.convRepo;
        const userRepo = this.userRepo;
        const app = this.app;
        const PORT = process.env.PORT || port;

        app.get('/', (req, res)=>{
            res.json({
                message : "Hi, jude!"
            })
        })
        /**
         * Route for conversation
         */
        app.route('/conversation').get((req, res)=>{
            let result = convRepo.read(req.query.page, req.query.limit)
            if(result === '' || result === undefined){
                result = {
                    data : "no data found"
                }
            }
            res.json({
                status_code : 200,
                message : "success get conversations ",
                results : result
            })
        }).post((req, res)=>{
            let create = convRepo.create(req.body);
            res.json({
                status_code : 200,
                message : "success get conversations ",
                results : create
            })
        })
        app.route('/conversation/:conversationId').get((req, res)=>{
            let result = convRepo.getById(req.params.conversationId);
            console.log(result)
            if(result === '' || result === undefined){
                result = {
                    data : "no data found"
                }
            }
            res.json({
                status_code : 200,
                message : "success get conversation by id "+req.params.conversationId,
                results : result
            })
        }).put((req, res)=>{
            let result = convRepo.update(req.params.conversationId, req.body);
            if(result === '' || result === undefined){
                result = {
                    data : "no data found"
                }
            }
            res.json({
                status_code : 201,
                message : "success update conversation by id "+req.params.conversationId,
                results : result
            }) 
        }).delete((req, res)=>{
            let result = convRepo.delete(req.params.conversationId);
            res.json({
                status_code : 201,
                message : "success delete conversation by id "+req.params.conversationId,
                results : []
            }) 
        })

        /**
         * Route for user
         */
        app.route('/users').post((req, res)=>{
            const create = userRepo.create(req.body);
            res.json({
                status_code : 201,
                message : "success created users "+req.body.name,
                results : create
            }) 
        }).get((req, res)=>{
            let result = userRepo.read(req.query.page, req.query.limit)
            if(result === '' || result === undefined){
                result = {
                    data : "no data found"
                }
            }
            res.json({
                status_code : 200,
                message : "success get conversations ",
                results : result
            })
        });
        app.route('/users/:userId').get((req, res)=>{
            let result = userRepo.getById(req.params.userId);
            res.json({
                status_code : 201,
                message : "success get users "+req.params.userId,
                results : result
            }) 
        });
        app.listen(PORT, ()=>{
            console.log('App running on port '+PORT);
        })
    }
}

module.exports = ApiServer;