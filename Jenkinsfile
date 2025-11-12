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

        stage('Determine Changes') {
            steps {
                script {
                    // Get changed files in the last commit
                    def changedFiles = sh(
                        script: "git diff --name-only HEAD~1 HEAD",
                        returnStdout: true
                    ).trim().split("\n")

                    env.BUILD_FRONTEND = "false"
                    env.BUILD_BACKEND = "false"

                    changedFiles.each { file ->
                        if (file.startsWith("ReactApp/")) {
                            env.BUILD_FRONTEND = "true"
                        } else {
                            env.BUILD_BACKEND = "true"
                        }
                    }

                    echo "Build Frontend: ${env.BUILD_FRONTEND}"
                    echo "Build Backend: ${env.BUILD_BACKEND}"
                }
            }
        }

        stage('Build and Push Frontend') {
            when {
                expression { env.BUILD_FRONTEND == "true" }
            }
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
            when {
                expression { env.BUILD_BACKEND == "true" }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKERHUB_CREDS}",
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh '''
                        echo $DH_PASS | docker login --username $DH_USER --password-stdin
                        docker build --platform linux/amd64 -t lakshan2002/tasknotifier-backend:latest -f Dockerfile .
                        docker push lakshan2002/tasknotifier-backend:latest
                        docker logout
                    '''
                }
            }
        }
    }
}
