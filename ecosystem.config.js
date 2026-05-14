module.exports = {
    apps: [
        {
            name: 'how-cooked-are-you',
            script: 'node_modules/.bin/next',
            args: 'start',
            cwd: '/var/www/how-cooked-are-you',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            // Tắt auto-restart khi file thay đổi (Jenkins sẽ trigger)
            watch: false,
            max_memory_restart: '512M',
            error_file: '/var/log/pm2/how-cooked-are-you-error.log',
            out_file: '/var/log/pm2/how-cooked-are-you-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
    ],
}
