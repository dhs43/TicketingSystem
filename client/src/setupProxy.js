const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        proxy(["/api", , "/otherApi"], { target: "http://localhost:8000"})
    );
};

// https://stackoverflow.com/questions/49165232/reactjs-app-in-heroku-invalid-host-header-host-configuration