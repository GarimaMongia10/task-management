pipeline {
    agent any

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/GarimaMongia10/task-management.git'
            }
        }

        stage('Build Application') {
            steps {
                sh 'cd backend && mvn clean package'
            }
        }

        stage('Cleanup Previous Stack') {
            steps {
                sh 'docker-compose down --remove-orphans || true'
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
