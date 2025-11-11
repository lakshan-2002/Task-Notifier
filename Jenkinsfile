pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = 'dockerhub-creds' // Jenkins credentials ID
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Push Frontend') {
            steps {
                dir('ReactApp') {
                    withCredentials([usernamePassword(
                        credentialsId: "${env.DOCKERHUB_CREDS}",
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_PASS'
                    )]) {
                        script {
                            docker.withRegistry('https://registry.hub.docker.com', "${env.DOCKERHUB_CREDS}") {
                                def frontendImage = docker.build("lakshan2002/tasknotifier-frontend:latest")
                                frontendImage.push()
                            }
                        }
                    }
                }
            }
        }

        stage('Build and Push Backend') {
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(
                        credentialsId: "${env.DOCKERHUB_CREDS}",
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_PASS'
                    )]) {
                        script {
                            docker.withRegistry('https://registry.hub.docker.com', "${env.DOCKERHUB_CREDS}") {
                                def backendImage = docker.build("lakshan2002/tasknotifier-backend:latest")
                                backendImage.push()
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
