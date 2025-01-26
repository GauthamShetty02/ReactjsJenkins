pipeline {
    agent any
    
    tools {
        gradle 'Gradle'
    }
    
    environment {
        CI = 'true'
        BRANCH_NAME = "${env.BRANCH_NAME}"
        ENV = "${env}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git --version'
                echo "Building branch: ${BRANCH_NAME}"
                echo "Environment Variable: ${ENV}"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'gradle installDependencies'
            }
        }
        
        stage('Build') {
            steps {
                sh 'gradle build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'gradle startServer &'
                sh 'sleep 20' // Give the server more time to start
                sh 'curl -s http://localhost:3001/api/hello || exit 1'
            }
        }

        stage('Deployment Info') {
            steps {
                echo "Deployment completed. Application is running at http://localhost:3001"
                echo "You can manually open this URL in your web browser to view the application."
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            script {
                sh 'pkill -f "node server/index.js" || true'
            }
        }
    }
}

