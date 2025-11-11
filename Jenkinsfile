pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = 'dockerhub-crds' // Jenkins credentials ID
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
                        credentialsId: "${DOCKERHUB_CREDS}",
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_PASS'
                    )]) {
                        sh '''
                            echo $DH_PASS | docker login --username $DH_USER --password-stdin
                            docker build -t lakshan2002/tasknotifier-frontend:latest .
                            docker push lakshan2002/tasknotifier-frontend:latest
                            docker logout
                        '''
                    }
                }
            }
        }

        stage('Build and Push Backend') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKERHUB_CREDS}",
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh '''
                        echo $DH_PASS | docker login --username $DH_USER --password-stdin
                        docker build -t lakshan2002/tasknotifier-backend:latest -f Dockerfile .
                        docker push lakshan2002/tasknotifier-backend:latest
                        docker logout
                    '''
                }
            }
        }
    }
}
