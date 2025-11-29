"use strict";

const clientModel = (function() {
    function getDom() {
        const dom = {
            nameInput: document.getElementById("nameInput"),
            passwordInput: document.getElementById("passwordInput"),
            nameResult: document.getElementById("nameResult"),
            passwordResult: document.getElementById("passwordResult")
        };
        return dom;
    }
    
    function getData() {
        let dom = getDom();
        let username = dom.nameInput.value;
        let password = dom.passwordInput.value;

        dom.nameResult.textContent = "";
        dom.passwordResult.textContent = "";

        if(username.length < 4 && password.length < 8) {
            dom.nameResult.textContent = "Name should have 4 letters";
            dom.passwordResult.textContent = "Password should have 8 letters";
            return false;
        } else if(username.length < 4) {
            dom.nameResult.textContent = "Name should have 4 letters";
            return false;
        } else if (password.length < 8) {
            dom.passwordResult.textContent = "Password should have 8 letters";
            return false;
        }

        let data = {
            username: username,
            password: password
        };
        return data;
    }

    async function post(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        return response.json();
    }
    
    return {post: post, getData: getData, getDom: getDom};
})();

async function processInput() {
    const data = clientModel.getData();
    if(data === false) {
        console.log('Bad input');
        return;
    }
    
    try {
        const response = await clientModel.post("http://localhost:1770/api/authentication/signUp", data);
        if(response.status === 'successful') {
            window.location.href = "./main.html";
        } else {
            console.log('Registration refused');
            const dom = clientModel.getDom();
            dom.nameResult.textContent = "Registration failed";
        }
    } catch(error) {
        console.log('Error:', error);
        const dom = clientModel.getDom();
        dom.passwordResult.textContent = "Server error";
    }
}