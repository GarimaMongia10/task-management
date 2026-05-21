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
                dir('backend') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Debug Environment') {
            steps {
                sh '''
                    pwd
                    ls -la
                    docker --version || true
                    docker compose version || true
                    docker compose -f docker-compose.yml -f docker-compose.ci.yml config
                '''
            }
        }

        stage('Cleanup Previous Stack') {
            steps {
                sh 'docker compose -f docker-compose.yml -f docker-compose.ci.yml down --remove-orphans || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose -f docker-compose.yml -f docker-compose.ci.yml build'
            }
        }

        stage('Deploy Containers') {
            steps {
                sh 'docker compose -f docker-compose.yml -f docker-compose.ci.yml up -d'
            }
        }
    }
}
