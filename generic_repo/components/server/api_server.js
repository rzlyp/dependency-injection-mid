'use strict';

const express = require('express');
const bodyParser = require('body-parser');

class ApiServer{
    constructor(options, convRepo, userRepo) {
        this.options = options;
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
        const options = this.options.routes;
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
         * Route using looping by options
         */
        // console.log(options)
        options.forEach((url)=>{
            let repo = convRepo;
            if(url.substr(0,5) === '/user'){
                repo = userRepo;
            }
            app.route(url).get((req, res)=>{;
                let page = 1;
                let limit = 5;
                if(Object.keys(req.query).length !== 0){
                    page = req.query.page;
                    limit = req.query.limit;
                }
                let result = repo.read(page,limit)
                if(result === '' || result === undefined){
                    result = {
                        data : "no data found"
                    }
                }
                res.json({
                    status_code : 200,
                    message : "success get data ",
                    results : result
                })
            }).post((req, res)=>{
                let create = repo.create(req.body);
                res.json({
                    status_code : 200,
                    message : "success get data",
                    results : create
                })
            })
            app.route(url+'/:id').get((req, res)=>{
                let result = repo.getById(req.params.id);
                console.log(result)
                if(result === '' || result === undefined){
                    result = {
                        data : "no data found"
                    }
                }
                res.json({
                    status_code : 200,
                    message : "success get data by id "+req.params.id,
                    results : result
                })
            }).put((req, res)=>{
                let result = repo.update(req.params.id, req.body);
                if(result === '' || result === undefined){
                    result = {
                        data : "no data found"
                    }
                }
                res.json({
                    status_code : 201,
                    message : "success update data by id "+req.params.id,
                    results : result
                }) 
            }).delete((req, res)=>{
                let result = repo.delete(req.params.id);
                res.json({
                    status_code : 201,
                    message : "success delete data by id "+req.params.id,
                    results : []
                }) 
            })
        })

        app.listen(PORT, ()=>{
            console.log('server listening on port '+PORT)
        })
    }
}

module.exports = ApiServer;