pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        dir('translator-api') {
          sh 'npm install'
        }
      }
    }

    stage('Run') {
      steps {
        dir('translator-api') {
          sh 'npm run dev'
        }
      }
    }
  }
}

