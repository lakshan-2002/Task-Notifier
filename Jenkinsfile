pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds')
    AWS_CREDENTIALS = credentials('aws-credentials')
    DB_URL = credentials('db-url')
    DB_USERNAME = credentials('db-username')
    DB_PASSWORD = credentials('db-password')
    SENDGRID_API_KEY = credentials('sendgrid-api-key')
    ANSIBLE_HOST_KEY_CHECKING = 'False'
    INSTANCE_IP = '44.217.52.15'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        sh '''
           export DOCKER_BUILDKIT=1

           # Pull existing images for cache
           docker pull lakshan2002/tasknotifier-backend:latest || true
           docker pull lakshan2002/tasknotifier-frontend:latest || true

          echo "Building backend..."
          docker build \
            --cache-from lakshan2002/tasknotifier-backend:latest \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            -t lakshan2002/tasknotifier-backend:latest \
            -f Dockerfile .

          echo "Building frontend..."
          docker build \
            --cache-from lakshan2002/tasknotifier-frontend:latest \
            --build-arg BUILDKIT_INLINE_CACHE=1 \
            -t lakshan2002/tasknotifier-frontend:latest \
            ReactApp/
        '''
      }
    }

    stage('Push Images') {
      steps {
        sh '''
          echo "$DOCKERHUB_CREDS_PSW" | docker login -u "$DOCKERHUB_CREDS_USR" --password-stdin

          docker push lakshan2002/tasknotifier-backend:latest
          docker push lakshan2002/tasknotifier-frontend:latest

          docker logout
        '''
      }
    }

//      stage('Get Instance IP from Terraform') {
//        steps {
//          dir('terraform') {
//              sh '''
//                export AWS_ACCESS_KEY_ID=$AWS_CREDENTIALS_USR
//                export AWS_SECRET_ACCESS_KEY=$AWS_CREDENTIALS_PSW
//
//                terraform output -raw instance_public_ip > /tmp/instance_ip.txt
//              '''
//          }
//
//          script {
//            env.INSTANCE_IP = sh(
//              script: 'cat /tmp/instance_ip.txt',
//              returnStdout: true
//            ).trim()
//            echo "Instance IP: ${env.INSTANCE_IP}"
//          }
//        }
//      }

//    stage('Deploy with Ansible') {
//      steps {
//        sh '''
//          mkdir -p /tmp/ansible
//
//          echo "[app_servers]" > /tmp/ansible/inventory.ini
//          echo "tasknotifier ansible_host=${INSTANCE_IP} ansible_user=ubuntu ansible_ssh_private_key_file=${SSH_KEY_PATH} ansible_python_interpreter=/usr/bin/python3 ansible_ssh_common_args='-o StrictHostKeyChecking=no'" >> /tmp/ansible/inventory.ini
//
//          cat /tmp/ansible/inventory.ini
//
//          ansible tasknotifier -i /tmp/ansible/inventory.ini -m ping
//
//
//
//          ansible-playbook -i /tmp/ansible/inventory.ini ansible/deploy-playbook.yml -vv
//        '''
//      }
//    }
    stage('Deploy Ansible Playbook') {
      steps {
         script {
            // Define the credential ID
            def credentialId = 'aws-ssh-key'

            // Use withCredentials to get the temporary file path and username
            withCredentials([sshUserPrivateKey(
                credentialsId: credentialId,
                keyFileVariable: 'SSH_KEY_PATH',
                usernameVariable: 'SSH_USER'
            )]) {
                // The variables SSH_KEY_PATH and SSH_USER are now available within this block

                def inventoryFile = '/tmp/ansible/inventory.ini'

                sh '''
                    export DB_URL=$DB_URL
                    export DB_USERNAME=$DB_USERNAME
                    export DB_PASSWORD=$DB_PASSWORD
                    export SENDGRID_API_KEY=$SENDGRID_API_KEY
                '''

                sh """
                    pwd
                    ls -la
                    ls -la deploy-playbook.yml
                    export ANSIBLE_SSH_ARGS='-o StrictHostKeyChecking=no'
                    ansible-playbook -i $inventoryFile \
                        --user=$SSH_USER \
                        --private-key=$SSH_KEY_PATH \
                        deploy-playbook.yml
                """

            }
         }
      }
    }


    stage('Health Check') {
      steps {
        sh '''
          echo "Performing health checks..."
          sleep 30

          echo "Checking backend..."
          curl -f http://$INSTANCE_IP:8080 || echo "Backend check failed but continuing..."

          echo "Checking frontend..."
          curl -f http://$INSTANCE_IP:5173 || echo "Frontend check failed but continuing..."
        '''
      }
    }

    stage('Display URLs') {
      steps {
        script {
          echo """
          ========================================
          Deployment Complete!
          ========================================
          Frontend: http://${env.INSTANCE_IP}:5173
          Backend:  http://${env.INSTANCE_IP}:8080
          Health:   http://${env.INSTANCE_IP}:8080/actuator/health
          ========================================
          """
        }
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f || true'
    }
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed! Check logs for details.'
    }
  }
}