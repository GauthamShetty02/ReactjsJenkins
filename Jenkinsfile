pipeline {
    agent any
    
    // Define tools we need
    tools {
        nodejs 'NodeJs' // Make sure this matches your Jenkins NodeJS installation name
    }
    
    // Environment variables
    environment {
        CI = 'true'
        BRANCH_NAME = "${env.BRANCH_NAME}"
        ENV = "${env}"
    }
    
    stages {
        // Checkout the code
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git --version'
                echo "Building branch: ${BRANCH_NAME}"
                echo "Environment Variable: ${ENV}"
            }
        }
        
        // Install dependencies
        stage('Install Dependencies') {
            steps {
                sh 'npm --version'
                sh 'npm install'
            }
        }
        
        // Run tests
        // stage('Test') {
        //     steps {
        //         sh 'npm test -- --watchAll=false'
        //     }
        // }
        
        // Build the application
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        // Deploy based on branch
       stage('Deploy') {
              steps {
                sh 'node server/index.js &'
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
        
        // stage('Deploy') {
        //     steps {
        //         script {
        //             if (env.BRANCH_NAME == 'main') {
        //                 echo 'Deploying to PRODUCTION'
        //                 // Add production deployment steps
        //             } else if (env.BRANCH_NAME == 'develop') {
        //                 echo 'Deploying to STAGING'
        //                 // Add staging deployment steps
        //             } else {
        //                 echo 'Deploying to DEV'
        //                 // Add development deployment steps
        //             }
        //         }
        //     }
        // }
    }
    
    // Post-build actions
    post {
        success {
            echo 'Pipeline succeeded!'
            // Add notifications or other success actions
        }
        failure {
            echo 'Pipeline failed!'
            // Add failure notifications
        }
        always {
            script {
                sh 'pkill -f "node server/index.js" || true'
            }
        }
    }
}