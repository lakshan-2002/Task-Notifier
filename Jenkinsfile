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

    stage('Set Image Tag') {
      steps {
        script {
          def branch = env.BRANCH_NAME ?: sh(returnStdout: true, script: "git rev-parse --abbrev-ref HEAD").trim()
          def sha = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
          branch = branch.replaceAll('/', '-')
          env.IMAGE_TAG = "${branch}-${sha}"
          echo "Image tag: ${env.IMAGE_TAG}"
        }
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: env.DOCKERHUB_CREDS,
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
        dir('frontend') {
          sh '''
            docker build -t lakshan2002/tasknotifier-frontend${IMAGE_TAG} .
            docker push lakshan2002/tasknotifier-frontend:${IMAGE_TAG}
          '''
          script {
            if (env.BRANCH_NAME == 'master') {
              sh '''
                docker tag lakshan2002/tasknotifier-frontend:${IMAGE_TAG} lakshan2002/tasknotifier-frontend:latest
                docker push lakshan2002/tasknotifier-frontend:latest
              '''
            }
          }
        }
      }
    }

    stage('Build and Push Backend') {
      steps {
        dir('backend') {
          sh '''
            docker build -t lakshan2002/tasknotifier-backend:${IMAGE_TAG} .
            docker push lakshan2002/tasknotifier-backend:${IMAGE_TAG}
          '''
          script {
            if (env.BRANCH_NAME == 'master') {
              sh '''
                docker tag lakshan2002/tasknotifier-backend:${IMAGE_TAG} lakshan2002/tasknotifier-backend:latest
                docker push lakshan2002/tasknotifier-backend:latest
              '''
            }
          }
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}
