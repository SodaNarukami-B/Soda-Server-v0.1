"use strict";

const serverModel = (function() {

    const express = require("express");
    const path = require("path");
    const app = express();
    const PORT = 1770;

    // extensions
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // browser env
    app.use(express.static('public'));

    // api data
    const api = {
        page: {
            path: "/api/page/",
            content: 0
        },
        users: {
            path: "/api/authentication/",
            content: [{
                username: "default",
                password: Date().toString()
            }]
        }
    };
    
    
    function startServer() {
        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
            api.page.content++;
        });

        app.post(`${api.users.path}signUp`, (req, res) => {
            const userData = req.body;
            
            if (api.users.content.some(user => user.username === userData.username)) {
                return res.json({ status: "refused", reason: "User already exists" });
            }
            
            try {
                let user ={
                    username: userData.username,
                    password: userData.password,
                    created: new Date().toISOString()
                }
                api.users.content.push(user);
                
                console.log("New user registered:", userData.username);
                console.log("Total users:", api.users.content.length);
                
                res.json({ status: "successful", reason: ""});
            } catch (error) {
                console.log("Error adding user:", error);
                res.json({ status: "refused", reason: "Server error" });
            }
        });

        app.get(`${api.users.path}users`, (req, res) => {
            res.json({
                total: api.users.content.length,
                users: api.users.content
            });
        });

        app.get("/main.html", (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'main.html'));
        });

        try {
            app.listen(PORT, () => {
                console.log("Server started on http://localhost:1770 | by Soda");
                console.log("Available routes:");
                console.log("  GET  /");
                console.log("  POST /api/authentication/signUp");
                console.log("  GET  /api/authentication/users");
            });
            return true;
        } catch(error) {
            console.log(`Failed to start a server. Error: ${error}`);
            return false;
        }
    }

    return {
        startServer: startServer
    };
})();

serverModel.startServer();