pipeline {
    agent any
    
    stages {
        stage('Build Backend') {
            steps {
                // Backend only needs install as there is no build script
                sh 'cd Backend && npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'cd Frontend && npm install && npm run build'
            }
        }
    }
}
