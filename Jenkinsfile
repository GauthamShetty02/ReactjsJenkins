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
    }
    
    stages {
        // Checkout the code
        stage('Checkout') {
            steps {
                checkout scm
                sh 'git --version'
                echo "Building branch: ${BRANCH_NAME}"
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
                sh 'npm start &'
                sh 'sleep 20' // Give the server some time to start
                sh 'curl http://localhost:3001/api/hello'
            }
        }

        stage('Open in Browser') {
            steps {
                script {
                    def openBrowser = """
                        if which xdg-open > /dev/null; then
                            xdg-open http://localhost:3001
                        elif which open > /dev/null; then
                            open http://localhost:3001
                        else
                            echo "Could not detect the web browser to use."
                        fi
                    """
                    sh openBrowser
                }
                echo "If the browser didn't open automatically, please visit http://localhost:3001 in your web browser."
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
        // always {
        //     script {
        //         sh 'pkill -f "node server/index.js" || true'
        //     }
        // }
    }
}