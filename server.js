"use strict"

const serverModel = (function(){

    const express = require("express");
    const app = express();
    const PORT = 1770;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('puplic'));

    function getConnectionStatus(){
        let connectionStatus = "connected";
        let timestamp = new Date().toISOString;
        let serverTime = Date();
        let status = {
            connectionStatus: connectionStatus,
            timestamp: timestamp,
            serverTime: serverTime
        }
        return status
    };

    const api = {
            echo: "/api/echo",
            guestbook: {
                path: "/api/guestbook",
                content: [{title: "Welcome", message: "Welcome"}]
            },
            page: {
                path: "/api/page",
                content: 0
            },
            status: "/api/status"
        };
    
    function startServer(){
        
        app.get("/", (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
            api.page.content++;
        });
        app.get(api.status, (req, res) => {
            res.send(JSON.stringify(getConnectionStatus()));
            console.log("Recived status request (GET)")
        });
        app.post(api.echo, (req, res) => {
            res.send(req.body);
            console.log("Recived data for echo (POST): " + req.body);
        });
        app.get(api.page.path, (req, res) => {
            res.send(JSON.stringify({views: api.page.content}));
            console.log("Recived views requset (GET)")
        })
        app.get(api.guestbook.path, (req, res) =>{
            res.send(JSON.stringify(api.guestbook.content));
            console.log("Recived guestbook data request (GET)");
        })
        app.post(api.guestbook.path, (req, res) => {
            if(req.body.title && req.body.message){
                let message = {
                    title: req.body.title,
                    message: req.body.message
                };
                api.guestbook.content.push(message);
                res.send({response: `Succsessfully sended to http://localhost/1770/api/guestbook`});
                console.log(`Recived message ${req.body}\nPushed to guestbook`);
            } else {
                res.status(400).json({
                    response: "400 Bad request | Try json with title and massage"
                })
            }
        })
        try{
            app.listen(PORT, () => {
                console.log("Server started on http://localhost:1770 | by Soda");
            });
            return true
        } catch(error){
            console.log(`Failed to start a server. Server occured from error: ${error}`);
            return false
        }

    };


    return {
        startServer: startServer
    }
})();

serverModel.startServer();