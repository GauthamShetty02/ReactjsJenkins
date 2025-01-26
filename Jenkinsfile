pipeline {
    agent any

    tools {
        nodejs "NodeJS 14"
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Client') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Test') {
            steps {
                dir('client') {
                    sh 'npm test -- --watchAll=false'
                }
            }
        }

        stage('Start Server') {
            steps {
                dir('server') {
                    sh 'npm install'
                    sh 'node index.js &'
                    sh 'sleep 10' // Give the server time to start
                }
            }
        }

        stage('Health Check') {
            steps {
                sh 'curl http://localhost:3001/api/health || exit 1'
            }
        }
    }

    post {
        always {
            sh 'pkill -f "node index.js" || true'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}