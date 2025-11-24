pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18-alpine
    command:
    - cat
    tty: true
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
"""
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                container('node') {
                    sh '''
                    cd Backend
                    npm install
                    '''
                }
            }
        }

        stage('Frontend Install & Build') {
            steps {
                container('node') {
                    sh '''
                    cd Frontend
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                container('dind') {
                    script {
                        // Check if docker-compose is available, otherwise install it or use docker build
                        // For this setup, we'll try to use docker build directly if compose isn't there, 
                        // but let's assume we want to build the images defined in docker-compose.yml
                        
                        // Note: Standard docker:dind might not have docker-compose installed.
                        // We will build images manually to be safe.
                        
                        sh 'docker build -t backend:latest ./Backend'
                        sh 'docker build -t frontend:latest ./Frontend'
                        
                        // If you have docker-compose, you can uncomment the line below:
                        // sh 'docker-compose build'
                    }
                }
            }
        }
    }
}
