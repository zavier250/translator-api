pipeline {
  agent any

  environment {
    // 注入 secret file 路径
    ENV_FILE = credentials('ifa-env-file')
  }

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
          // 权限 & 拷贝 env
          sh 'chmod u+w .'
          sh 'cp $ENV_FILE .env'
          // 加载 .env 为环境变量并运行
          sh 'export $(cat .env | xargs) && npm run dev'
        }
      }
    }

    stage('Cleanup') {
      steps {
        dir('translator-api') {
          sh 'rm -f .env'
        }
      }
    }
  }
}
