pipeline {
    agent any

    environment {
        APP_DIR = '/var/www/how-cooked-are-you'
        PM2_APP_NAME = 'how-cooked-are-you'
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh '''
                    rm -f package-lock.json
                    npm install --include=dev
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_API_KEY'),
                    string(credentialsId: 'GEMINI_MODEL', variable: 'GEMINI_MODEL')
                ]) {
                    sh '''
                        set -e

                        # Sync files to app directory (excluding node_modules and env files)
                        rsync -av --delete \
                            --exclude='node_modules' \
                            --exclude='.git' \
                            --exclude='.env.local' \
                            ./ "${APP_DIR}/"

                        # Write runtime env file (Next.js loads .env.local on `next start`)
                        umask 077
                        : > "${APP_DIR}/.env.local"
                        printf 'GEMINI_API_KEY=%s\n' "${GEMINI_API_KEY}" >> "${APP_DIR}/.env.local"
                        printf 'GEMINI_MODEL=%s\n'   "${GEMINI_MODEL}"   >> "${APP_DIR}/.env.local"

                        cd "${APP_DIR}"

                        # Install production dependencies only
                        npm install --omit=dev

                        # Restart or start the app with PM2 (--update-env picks up new env)
                        if pm2 describe "${PM2_APP_NAME}" > /dev/null 2>&1; then
                            pm2 reload "${PM2_APP_NAME}" --update-env
                        else
                            pm2 start ecosystem.config.js
                            pm2 save
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful — ${env.BUILD_URL}"
        }
        failure {
            echo "Build failed at stage. Check console output: ${env.BUILD_URL}console"
        }
        always {
            cleanWs()
        }
    }
}
