pipeline {
    agent any
    
    tools {
        gradle 'Gradle'
    }
    
    environment {
        CI = 'true'
        BRANCH_NAME = "${env.BRANCH_NAME}"
        ENV = "${env}"
        SERVER_PID_FILE = 'server.pid'
        JENKINS_NODE_IP = sh(script: "hostname -I | awk '{print \$1}'", returnStdout: true).trim()
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

        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: 'client/dist/**', fingerprint: true
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh '''
                        gradle startServer > server.log 2>&1 &
                        echo $! > ${SERVER_PID_FILE}
                        sleep 15
                        if ps -p $(cat ${SERVER_PID_FILE}) > /dev/null; then
                            echo "Server started successfully"
                        else
                            echo "Server failed to start"
                            cat server.log
                            exit 1
                        fi
                    '''
                }
                sh '''
                    for i in {1..5}; do
                        if curl -s http://${env.JENKINS_NODE_IP}:3001/api/hello; then
                            echo "Server is responsive"
                            exit 0
                        fi
                        sleep 5
                    done
                    echo "Server is not responsive after multiple attempts"
                    cat server.log
                    exit 1
                '''
            }
        }

        stage('Deployment Info') {
            steps {
                echo "Deployment completed. Application is running at http://${env.JENKINS_NODE_IP}:3001"
                echo "You can manually open this URL in your web browser to view the application."
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
            echo "The application is now accessible at http://${env.JENKINS_NODE_IP}:3001"
        }
        failure {
            echo 'Pipeline failed!'
            sh 'cat server.log'
        }
        always {
            script {
                echo 'Keeping the server running. To stop it later, use: kill $(cat ${SERVER_PID_FILE})'
            }
        }
    }
}

