pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/GarimaMongia10/task-management'
            }
        }

        stage('Build Application') {
            steps {
                sh 'cd backend && mvn clean package'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
