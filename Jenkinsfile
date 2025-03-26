pipeline {
  agent any

  environment {
    // 把 secret file 注入为临时文件路径（ENV_FILE 是变量名，你可以自定义）
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
          // 将注入的 ENV_FILE 内容复制为 .env 文件供 Node.js 项目识别
          sh 'cp $ENV_FILE .env'
          sh 'npm run dev'
        }
      }
    }
  }
}


