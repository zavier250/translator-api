pipeline {
  agent any

  stages {
    stage('Clone') {
      steps {
        echo 'Cloning...'
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run') {
      steps {
        sh 'npm run dev'
      }
    }
  }
}
