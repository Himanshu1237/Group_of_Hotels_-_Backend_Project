const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            fs.readFile(path.join(__dirname, 'login.html'), 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading the login page');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else if (req.url === '/index') {
            fs.readFile(path.join(__dirname, 'index.html'), 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading the index page');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else if (req.url === '/register') {
            fs.readFile(path.join(__dirname, 'register.html'), 'utf-8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading the registration page');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else if (req.url.endsWith('.css')) {
            const cssPath = path.join(__dirname, req.url);
            fs.readFile(cssPath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('CSS file not found');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            });
        } else if (req.url.endsWith('.js')) { // Serve JS files (including gsap.js)
            const jsPath = path.join(__dirname, req.url);
            fs.readFile(jsPath, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('JavaScript file not found');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else if (req.method === 'POST') {
        if (req.url === '/login') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const { username, password } = querystring.parse(body);

                fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error reading user data');
                        return;
                    }

                    const users = JSON.parse(data);

                    const user = users.find(u => u.username === username && u.password === password);

                    if (user) {
                        res.writeHead(302, { 'Location': '/index' });
                        res.end();
                    } else {
                        res.writeHead(302, { 'Location': '/register' });
                        res.end();
                    }
                });
            });
        } else if (req.url === '/register') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const { username, password } = querystring.parse(body);
                const userData = { username, password };

                fs.readFile(path.join(__dirname, 'users.json'), 'utf-8', (err, data) => {
                    let users = [];

                    if (!err) {
                        users = JSON.parse(data);
                    }

                    users.push(userData);

                    fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error saving registration data');
                            return;
                        }
                        res.writeHead(302, { 'Location': '/' });
                        res.end();
                    });
                });
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
