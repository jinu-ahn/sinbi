pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials') // Docker Hub 자격 증명
        MATTERMOST_ENDPOINT = 'https://meeting.ssafy.com/hooks/bwr8icyss3dzprmdjy1eh8qs5c'
        MATTERMOST_CHANNEL = 'c104-jenkins'
        USER_IMAGE = 'siokim002/sinbi_user'
        FILTER_IMAGE = 'siokim002/sinbi_filter'
        ACCOUNT_IMAGE = 'siokim002/sinbi_account'
        VIRTUAL_ACCOUNT_IMAGE = 'siokim002/sinbi_virtual_account'
        FRONTEND_IMAGE = 'siokim002/sinbi_frontend'
        GITOPS_REPO = 'git@github.com:zion0425/sinbi_gitops.git' // GitOps 저장소 주소
        GITOPS_CREDENTIALS = 'gitops_pk' // Jenkins에 등록된 GitOps 배포 키의 Credential ID
        GITLAB_CREDENTIALS = 'gitlab' // GitLab 자격 증명 ID
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }

    stages {
        stage('Start Notification') {
            steps {
                script {
                    sendNotification('warning', '빌드 시작')
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    // 소스 코드 체크아웃
                    git url: 'https://lab.ssafy.com/s11-ai-speech-sub1/S11P21C104.git', branch: 'release', credentialsId: GITLAB_CREDENTIALS

                    // 변경된 파일 목록 가져오기
                    def changes = sh(script: "git diff --name-only HEAD~1 HEAD", returnStdout: true).trim()
                    println "Changed files:\n${changes}"

                    // 변경된 서비스 확인
                    changedServices = []
                    if (changes.contains('frontend/')) {
                        changedServices.add('frontend')
                    }
                    if (changes.contains('filter/')) {
                        changedServices.add('filter')
                    }
                    if (changes.contains('user/')) {
                        changedServices.add('user')
                    }
                    if (changes.contains('account/')) {
                        changedServices.add('account')
                    }
                    if (changes.contains('virtualAccount/')) {
                        changedServices.add('virtualAccount')
                    }
                    println "Changed services: ${changedServices}"
                }
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    // Docker Hub 로그인
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'

                    for (service in changedServices) {
                        def imageName = ""
                        def dirPath = ""
                        if (service == 'frontend') {
                            imageName = FRONTEND_IMAGE
                            dirPath = 'frontend'
                        } else if (service == 'filter') {
                            imageName = FILTER_IMAGE
                            dirPath = 'filter'
                        } else if (service == 'user') {
                            imageName = USER_IMAGE
                            dirPath = 'user'
                        } else if (service == 'account') {
                            imageName = ACCOUNT_IMAGE
                            dirPath = 'account'
                        } else if (service == 'virtualAccount') {
                            imageName = VIRTUAL_ACCOUNT_IMAGE
                            dirPath = 'virtualAccount'
                        }

                        // Docker 이미지 빌드
                        dir(dirPath) {
                            sh "docker build --no-cache -t ${imageName}:${env.BUILD_NUMBER} ."
                        }

                        // Docker 이미지 푸시
                        sh "docker push ${imageName}:${env.BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Update GitOps Repo') {
            steps {
                script {
                    dir('gitops') {
                        // GitOps 저장소 클론
                        git url: GITOPS_REPO, branch: 'main', credentialsId: GITOPS_CREDENTIALS

                        for (service in changedServices) {
                            def imageName = ""
                            def deploymentFile = ""
                            if (service == 'frontend') {
                                imageName = FRONTEND_IMAGE
                                deploymentFile = 'frontend-deployment.yaml'
                            } else if (service == 'filter') {
                                imageName = FILTER_IMAGE
                                deploymentFile = 'filter-deployment.yaml'
                            } else if (service == 'user') {
                                imageName = USER_IMAGE
                                deploymentFile = 'user-deployment.yaml'
                            } else if (service == 'account') {
                                imageName = ACCOUNT_IMAGE
                                deploymentFile = 'account-deployment.yaml'
                            } else if (service == 'virtualAccount') {
                                imageName = VIRTUAL_ACCOUNT_IMAGE
                                deploymentFile = 'virtual-account-deployment.yaml'
                            }

                            // deployment.yaml 파일의 이미지 태그 업데이트
                            sh """
                            sed -i 's#image: .*#image: ${imageName}:${env.BUILD_NUMBER}#' ${deploymentFile}
                            """
                        }

                        // 변경 사항 커밋 및 푸시
                        sh """
                        git config user.name "Jenkins"
                        git config user.email "jenkins@gitops.com"
                        git add .
                        git commit -m "Update images for services: ${changedServices.join(', ')}"
                        git push origin HEAD:main
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                sendNotification('good', '빌드 성공')
                cleanWs()
            }
        }
        failure {
            script {
                sendNotification('danger', '빌드 실패')
                cleanWs()
            }
        }
    }
}

def sendNotification(String color, String status) {
    def gitCommitterName = sh(script: "git log -1 --pretty=format:'%an'", returnStdout: true).trim()
    def gitCommitMessage = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
    
    mattermostSend(
        color: color,
        message: """${status}: 빌드 번호 #${env.BUILD_NUMBER}
커밋 작성자: ${gitCommitterName}
커밋 메시지: ${gitCommitMessage}
(<${env.BUILD_URL}|빌드 상세 정보>)""",
        endpoint: MATTERMOST_ENDPOINT,
        channel: MATTERMOST_CHANNEL
    )
}
