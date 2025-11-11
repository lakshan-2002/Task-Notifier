pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = 'dockerhub-creds'  // Jenkins credentials ID
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: "${DOCKERHUB_CREDS}",
          usernameVariable: 'DH_USER',
          passwordVariable: 'DH_PASS'
        )]) {
          sh '''
            echo "$DH_PASS" | docker login --username "$DH_USER" --password-stdin
          '''
        }
      }
    }

    stage('Build and Push Frontend') {
      steps {
        dir('ReactApp') {
          sh '''
            docker build -t lakshan2002/tasknotifier-frontend:latest .
            docker push lakshan2002/tasknotifier-frontend:latest
          '''
        }
      }
    }

    stage('Build and Push Backend') {
      steps {
          sh '''
            docker build -t lakshan2002/tasknotifier-backend:latest -f Dockerfile
            docker push lakshan2002/tasknotifier-backend:latest
          '''
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
