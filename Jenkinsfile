pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = 'dockerhub-crds'   // Jenkins credentials ID
  }

  stages {
    stage('Prepare') {
      steps {
        script {
          // Ensure full Git history is available
          sh '''
            git fetch --unshallow || true
            git fetch origin master || true
          '''

          // Get list of changed files compared to master
          def changedFilesRaw = sh(
            script: "git diff --name-only origin/master...HEAD || true",
            returnStdout: true
          ).trim()

          def changedFiles = changedFilesRaw ? changedFilesRaw.split('\n') : []
          echo "Changed files: ${changedFiles}"

          // Detect changed folders
          def frontendChanged = changedFiles.any { it.startsWith('ReactApp/') }
          def backendChanged  = changedFiles.any { !it.startsWith('ReactApp/') && it != '' }

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
            docker buildx build --platform linux/amd64 -t lakshan2002/tasknotifier-backend:latest .
            docker push lakshan2002/tasknotifier-backend:latest
            docker logout
          '''
        }
      }
    }

    stage('No Changes Detected') {
      when {
        expression { return env.CHANGED_FRONTEND != 'true' && env.CHANGED_BACKEND != 'true' }
      }
      steps {
        echo 'No relevant changes detected. Skipping build and push.'
      }
    }
  }
}
