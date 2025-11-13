pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = 'dockerhub-crds'   // Jenkins credentials ID
  }

  stages {
    stage('Prepare') {
      steps {
        script {
          // Define variables properly
          def changedFilesRaw = sh(
            script: "git diff --name-only HEAD~1 HEAD || true",
            returnStdout: true
          ).trim()

          def changedFiles = changedFilesRaw ? changedFilesRaw.split('\n') : []
          echo "Changed files: ${changedFiles}"

          def frontendChanged = changedFiles.any { it.contains('ReactApp/') }
          def backendChanged  = changedFiles.any { !it.contains('ReactApp/') && it != '' }

          // Store results in environment variables
          env.CHANGED_FRONTEND = frontendChanged.toString()
          env.CHANGED_BACKEND  = backendChanged.toString()

          echo "Frontend changed: ${env.CHANGED_FRONTEND}"
          echo "Backend changed: ${env.CHANGED_BACKEND}"
        }
      }
    }

    stage('Build and Push Frontend') {
      when {
        expression { return env.CHANGED_FRONTEND == 'true' }
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
        expression { return env.CHANGED_BACKEND == 'true' }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker build --platform linux/amd64 -t lakshan2002/tasknotifier-backend:latest -f Dockerfile .
            docker push lakshan2002/tasknotifier-backend:latest
            docker logout
          '''
        }
      }
    }
  }
}
