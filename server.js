const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 3001;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const filePath = path.join(__dirname, req.url === '/' ? 'login.html' : req.url);
        const extname = path.extname(filePath);
        let contentType = 'text/html';

        switch (extname) {
            case '.js':
                contentType = 'application/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
            case '.ico':
                contentType = 'image/x-icon';
                break;
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(data, 'utf-8');
                    });
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data, 'utf-8');
            }
        });
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
                        res.writeHead(302, { 'Location': '/index.html' });
                        res.end();
                    } else {
                        res.writeHead(302, { 'Location': '/register.html' });
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
