pipeline {
    agent any
    
    tools {
        gradle 'Gradle'
        dockerTool 'docker-node'
    }
    
    environment {
        CI = 'true'
        BRANCH_NAME = "${env.BRANCH_NAME}"
        ENV = "${env}"
        DOCKER_IMAGE = 'gshetty1/react-app'
        DOCKER_TAG = 'latest'
        DOCKER_CREDENTIALS = 'docker-hub-credentials'
        KUBE_CONFIG = credentials('kubeconfig-credentials')  // Kubernetes config stored in Jenkins
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
                archiveArtifacts artifacts: 'client/dist/**', fingerprint: true
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | /usr/local/bin/docker login -u "$DOCKER_USERNAME" --password-stdin
                            /usr/local/bin/docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
                            /usr/local/bin/docker push $DOCKER_IMAGE:$DOCKER_TAG
                            /usr/local/bin/docker logout
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                   withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')]) {
    sh '''
        export KUBECONFIG=$KUBECONFIG
        kubectl apply -f k8s/deployment.yaml
        kubectl apply -f k8s/service.yaml
        kubectl apply -f k8s/ingress.yaml
    '''
}

                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-credentials', variable: 'KUBECONFIG')]) {
                        sh '''
                            kubectl get pods -n default
                            kubectl get svc -n default
                            kubectl get ingress -n default
                        '''
                    }
                }
            }
        }

        stage('Deployment Info') {
            steps {
                echo "Deployment completed. Application is running in Kubernetes."
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded! The application is deployed to Kubernetes.'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
