module.exports = {
    apps: [
        {
            name: "t2u-webinar-ai",
            cwd: "/home/sites/t2u-webinar-ai/current",
            script: "node_modules/.bin/next",
            args: "start -p 3105",
            instances: 1,
            exec_mode: "fork",
            kill_timeout: 5000,
            autorestart: true,
            max_restarts: 10,
            min_uptime: "10s",
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "production",
                PORT: 3105
            }
        }
    ],

    deploy: {
        production: {
            user: "sites",
            host: "CCL-PROD-SITES",
            ref: "origin/main",
            repo: "git@github-t2u-webinar-ai:codecafe-lab-it-solutions/t2u_webinar_ai.git",
            path: "/home/sites/t2u-webinar-ai",
            'post-deploy': 'bash scripts/post-deploy.sh'
        }
    }
};
