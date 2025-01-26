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
        
        // stage('Deploy') {
        //     steps {
        //         sh 'gradle startServer &'
        //         sh 'sleep 20' // Give the server more time to start
        //         sh 'curl -s http://localhost:3001/api/hello || exit 1'
        //     }
        // }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                        gradle startServer &
                        SERVER_PID=$!
                        echo $SERVER_PID > server.pid
                        sleep 15
                        if ps -p $SERVER_PID > /dev/null; then
                            echo "Server started successfully"
                        else
                            echo "Server failed to start"
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
                    exit 1
                '''
            }
        }

          
        // stage('Deploy Locally') {
        //     steps {
        //         script {
        //             sh '''
        //                 echo "Starting the application..."
        //                 nohup npm start > app.log 2>&1 &
        //                 echo $! > .pidfile
        //                 sleep 30
        //                 if ps -p $(cat .pidfile) > /dev/null; then
        //                     echo "Application started successfully"
        //                 else
        //                     echo "Application failed to start"
        //                     exit 1
        //                 fi
        //             '''
        //         }
        //         sh '''
        //             for i in {1..5}; do
        //                 if curl -s http://localhost:3000; then
        //                     echo "Application is responsive"
        //                     exit 0
        //                 fi
        //                 sleep 5
        //             done
        //             echo "Application is not responsive after multiple attempts"
        //             exit 1
        //         '''
        //     }
        // }


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

