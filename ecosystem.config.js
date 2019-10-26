module.exports = {
    apps: [
        {
            name: "ticketing-system",
            script: "./server/server.js",
            watch: true,
            env: {
                "PORT": 8000,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 3000,
                "NODE_ENV": "production",
            }
        }
    ]
}
