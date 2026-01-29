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

    stage('Generate Inventory File') {
        steps {
            script {
                // Get the EC2 instance IP from Terraform output
                def instanceIP = sh(
                    script: 'cd terraform && terraform output -raw instance_public_ip',
                    returnStdout: true
                ).trim()

                echo "Instance IP: ${instanceIP}"

                // Generate inventory file from template
                sh """
                    sed 's|INSTANCE_IP_PLACEHOLDER|${instanceIP}|g; s|SSH_KEY_PATH_PLACEHOLDER|${SSH_KEY_PATH}|g' \
                        ansible/inventory.ini.template > ansible/inventory.ini

                    echo "Generated inventory file:"
                    cat ansible/inventory.ini
                """
            }
        }
    }

    stage('Deploy Ansible Playbook') {
      steps {
         script {
           dir('ansible'){
            // Define the credential ID
            def credentialId = 'aws-ssh-key'

            // Use withCredentials to get the temporary file path and username
            withCredentials([sshUserPrivateKey(
                credentialsId: credentialId,
                keyFileVariable: 'SSH_KEY_PATH',
                usernameVariable: 'SSH_USER'
            )]) {
                sh '''
                    inventoryFile="/tmp/ansible_inventory.ini"
                    cat ${inventoryFile}

                    export DB_URL=$DB_URL
                    export DB_USERNAME=$DB_USERNAME
                    export DB_PASSWORD=$DB_PASSWORD
                    export SENDGRID_API_KEY=$SENDGRID_API_KEY

                    ansible tasknotifier -i ${inventoryFile} -m ping

                    ansible-playbook -i ${inventoryFile} deploy-playbook.yml -vv
                '''
            }
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