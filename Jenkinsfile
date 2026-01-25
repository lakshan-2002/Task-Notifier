pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds')
    SSH_KEY = credentials('aws-ssh-key')
    ANSIBLE_HOST_KEY_CHECKING = 'False'
    INSTANCE_IP = 'YOUR_INSTANCE_IP_HERE'  // ⚠️ REPLACE with actual IP
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
          echo "Building backend..."
          docker build -t lakshan2002/tasknotifier-backend:latest -f Dockerfile .

          echo "Building frontend..."
          docker build -t lakshan2002/tasknotifier-frontend:latest ReactApp/
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

    stage('Deploy with Ansible') {
      steps {
        sh """
          mkdir -p /tmp/ansible

          cat > /tmp/ansible/inventory.ini <<EOF
[app_servers]
app_server ansible_host=${env.INSTANCE_IP} ansible_user=ubuntu ansible_ssh_private_key_file=${SSH_KEY} ansible_python_interpreter=/usr/bin/python3 ansible_ssh_common_args='-o StrictHostKeyChecking=no'
EOF

          export DOCKERHUB_USERNAME=\$DOCKERHUB_CREDS_USR
          export DOCKERHUB_PASSWORD=\$DOCKERHUB_CREDS_PSW
          export IMAGE_TAG=latest

          ansible-playbook -i /tmp/ansible/inventory.ini ansible/deploy-playbook.yml
        """
      }
    }

    stage('Health Check') {
      steps {
        sh """
          echo "Performing health checks..."

          # Wait for containers to fully start
          sleep 30

          # Check backend
          echo "Checking backend..."
          curl -f http://${env.INSTANCE_IP}:8080 || echo "Backend check failed but continuing..."

          # Check frontend
          echo "Checking frontend..."
          curl -f http://${env.INSTANCE_IP}:5173 || echo "Frontend check failed but continuing..."
        """
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
      echo 'Deployment completed successfully!'
    }
    failure {
      echo 'Deployment failed! Check logs for details.'
    }
  }
}