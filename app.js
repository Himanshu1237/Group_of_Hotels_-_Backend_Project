const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const server = http.createServer(function(req, res) {
    if (req.url === '/' || req.url === '/index.html') {
        // Serve the HTML file
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile('index.html', function(error, data) {
            if (error) {
                res.writeHead(404);
                res.write('Error: File Not Found');
            } else {
                res.write(data);
            }
            res.end();
        });
    } else if (req.url.startsWith('/styles/')) {
        // Serve CSS files
        const cssPath = path.join(__dirname, req.url);
        fs.readFile(cssPath, function(error, data) {
            if (error) {
                res.writeHead(404);
                res.write('Error: File Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(data);
            }
            res.end();
        });
    } else {
        // Handle other requests (e.g., 404)
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Error: File Not Found');
        res.end();
    }
});

server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
});
