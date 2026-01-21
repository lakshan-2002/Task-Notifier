pipeline {
  agent any
  environment {
    DOCKERHUB_CREDS = 'dockerhub-crds'   // Jenkins credentials ID
    PATH = "/usr/bin:${env.PATH}"
  }
  stages {
    stage('Build and Push Frontend') {
      steps {
        dir('ReactApp') {
          withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
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
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker build -t lakshan2002/tasknotifier-backend:latest -f Dockerfile .
            docker push lakshan2002/tasknotifier-backend:latest
            docker logout
          '''
        }
      }
    }
  }
}
