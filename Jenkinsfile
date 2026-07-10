pipeline {
    agent any

    tools {
        maven 'Maven'
    }

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
                    docker compose config
                '''
            }
        }

        stage('Cleanup Previous Stack') {
            steps {
                withEnv([
                    'FRONTEND_PORT=3002',
                    'BACKEND_PORT=8080',
                    'MYSQL_PORT=3307',
                    'ADMINER_PORT=8082',
                    'PROMETHEUS_PORT=9090',
                    'GRAFANA_PORT=3004'
                ]) {
                    sh 'docker compose down --remove-orphans || true'
                }
            }
        }

        stage('Docker Build') {
            steps {
                withEnv([
                    'FRONTEND_PORT=3002',
                    'BACKEND_PORT=8080',
                    'MYSQL_PORT=3307',
                    'ADMINER_PORT=8082',
                    'PROMETHEUS_PORT=9090',
                    'GRAFANA_PORT=3004'
                ]) {
                    sh 'docker compose build'
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                withEnv([
                    'FRONTEND_PORT=3002',
                    'BACKEND_PORT=8080',
                    'MYSQL_PORT=3307',
                    'ADMINER_PORT=8082',
                    'PROMETHEUS_PORT=9090',
                    'GRAFANA_PORT=3004'
                ]) {
                    sh 'docker compose up -d'
                }
            }
        }
    }
}