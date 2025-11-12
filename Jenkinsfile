pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = 'dockerhub-creds'   // Jenkins credentials ID
  }

  stages {
    stage('Prepare') {
      steps {
        script {
          // Get list of changed files from the last commit
          CHANGED_FILES = sh(
            script: "git diff --name-only HEAD~1 HEAD || true",
            returnStdout: true
          ).trim().split('\n')

          echo "Changed files: ${CHANGED_FILES}"

          CHANGED_FRONTEND = CHANGED_FILES.any { it.startsWith('ReactApp/') }
          CHANGED_BACKEND  = CHANGED_FILES.any { 
            !it.startsWith('ReactApp/') && it != ''
          }
        }
      }
    }

    stage('Build and Push Frontend') {
      when {
        expression { return CHANGED_FRONTEND }
      }
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
      when {
        expression { return CHANGED_BACKEND }
      }
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
