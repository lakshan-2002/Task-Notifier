pipeline {
    agent any

    stages {
        stage('Print Hello World') {
            steps {
                echo 'Hello, World!'
            }
        }
        stage('Run hello_world.py') {
            steps {
            checkout scm
            sh 'python3 hello_world.py'
            }
        }
    }
}
