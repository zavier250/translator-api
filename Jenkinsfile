pipeline {
  agent any

  environment {
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
            // 授权并复制 env
            sh 'chmod u+w .'
            sh 'cp $ENV_FILE .env'

            // 打印调试用
            sh 'echo "========= .env 文件内容如下 ========="'
            sh 'cat .env'
            sh 'echo "===================================="'

            // ✅ 加载 .env 到环境变量（这一步最关键）
            sh 'export $(cat .env | xargs) && npm run dev'
            }
        }
    }

    stage('Cleanup') {
      steps {
        dir('translator-api') {
          // 删除 .env 文件以确保安全
          sh 'rm -f .env'
          echo '.env 文件已删除'
        }
      }
    }
  }
}

