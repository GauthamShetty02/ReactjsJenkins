pipeline {
    agent {
        docker {
            image 'docker:node'  // Use the official Docker image (ensure it's available on your Jenkins agent)
            label 'docker-node'   // Label for nodes if you're using specific agents for Docker
            args '-v /var/run/docker.sock:/var/run/docker.sock' // Mount Docker socket for Docker commands to work
        }
    }
    
    tools {
        gradle 'Gradle'
    }
    
    environment {
        CI = 'true'
        BRANCH_NAME = "${env.BRANCH_NAME}"
        ENV = "${env}"
        // DOCKER_USERNAME = credentials('docker-hub-username') // Docker Hub username (stored in Jenkins credentials)
        // DOCKER_PASSWORD = credentials('docker-hub-password') // Docker Hub password (stored in Jenkins credentials)
        DOCKER_IMAGE = 'gshetty1/react-app'
        DOCKER_TAG = 'latest'
        DOCKER_CREDENTIALS = 'docker-hub-credentials'  // Set this in Jenkins credentials
        SERVER_PID_FILE = 'server.pid'
        // JENKINS_NODE_IP = sh(script: "hostname -I | awk '{print \$1}'", returnStdout: true).trim()
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

        stage('Build Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                            docker build -t $DOCKER_IMAGE:$DOCKER_TAG ./client/build
                        '''
                    }
                }
            }
        }

        // stage('Push to Docker Hub') {
        //     steps {
        //         script {
        //             withDockerRegistry([credentialsId: DOCKER_CREDENTIALS, url: '']) {
        //                 sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
        //             }
        //         }
        //     }
        // }

        // stage('Deploy Container') {
        //     steps {
        //         script {
        //             sh '''
        //                 docker stop react-app || true
        //                 docker rm react-app || true
        //                 docker run -d -p 3001:3001 --name react-app $DOCKER_IMAGE:$DOCKER_TAG
        //             '''
        //         }
        //     }
        // }

        
        
        
        stage('Deploy') {
            steps {
                script {
                    sh '''
                        nohup gradle startServer > server.log 2>&1 &
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
                        if curl -s http://localhost:3001/api/hello; then
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
                echo "Deployment completed. Application is running at http://localhost:3001"
                echo "You can manually open this URL in your web browser to view the application."
              
            }
        }
    }
    
    post {
      success {
            echo 'Pipeline succeeded!'
            echo "The application is now accessible at http://localhost:3001"
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

