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
                    'FRONTEND_PORT=0',
                    'BACKEND_PORT=0',
                    'MYSQL_PORT=0',
                    'ADMINER_PORT=0',
                    'PROMETHEUS_PORT=0',
                    'GRAFANA_PORT=0'
                ]) {
                    sh 'docker compose down --remove-orphans || true'
                }
            }
        }

        stage('Docker Build') {
            steps {
                withEnv([
                    'FRONTEND_PORT=0',
                    'BACKEND_PORT=0',
                    'MYSQL_PORT=0',
                    'ADMINER_PORT=0',
                    'PROMETHEUS_PORT=0',
                    'GRAFANA_PORT=0'
                ]) {
                    sh 'docker compose build'
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                withEnv([
                    'FRONTEND_PORT=0',
                    'BACKEND_PORT=0',
                    'MYSQL_PORT=0',
                    'ADMINER_PORT=0',
                    'PROMETHEUS_PORT=0',
                    'GRAFANA_PORT=0'
                ]) {
                    sh 'docker compose up -d'
                }
            }
        }
    }
}