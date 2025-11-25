pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    args: 
    - "--storage-driver=overlay2"
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
    - name: workspace-volume
      mountPath: /home/jenkins/agent
  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    volumeMounts:
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume
  volumes:
  - name: workspace-volume
    emptyDir: {}
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    stages {
        stage('Initialize') {
            steps {
                echo "🚀 Starting Pipeline..."
            }
        }

        stage('Build Docker Images') {
            steps {
                container('dind') {
                    sh '''
                        # Wait for Docker daemon to be ready
                        echo "⏳ Waiting for Docker daemon..."
                        while ! docker info > /dev/null 2>&1; do
                            echo "Waiting for Docker daemon..."
                            sleep 2
                        done
                        echo "✅ Docker daemon is ready!"
                        
                        echo "➡️ Building Images..."
                        
                        # --- THIS IS THE MAGIC LINE ---
                        # We take your "./Backend" folder but name the image "server"
                        docker build -t server:latest ./Backend
                        
                        # We take your "./Frontend" folder but name the image "client"
                        docker build -t client:latest ./Frontend
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401137', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401137_CampusConnect \
                              -Dsonar.sources=./Backend \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        // YOUR FRIEND'S EXACT LOGIN STAGE
        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker --version
                        sleep 10
                        docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        // YOUR FRIEND'S EXACT TAG + PUSH STAGE
        stage('Tag + Push Images') {
            steps {
                container('dind') {
                    sh '''
                        docker tag server:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/server:latest
                        docker tag client:latest nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/client:latest

                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/server:latest
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/client:latest
                    '''
                }
            }
        }

        stage('Create Namespace & Secrets') {
            steps {
                container('kubectl') {
                    withCredentials([file(credentialsId: 'campus-connect-env-file', variable: 'ENV_FILE_PATH')]) {
                        sh '''
                            kubectl get namespace 2401137 || kubectl create namespace 2401137

                            kubectl create secret docker-registry nexus-secret \
                              --docker-server=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 \
                              --docker-username=admin \
                              --docker-password=Changeme@2025 \
                              --namespace=2401137 \
                              --dry-run=client -o yaml | kubectl apply -f -

                            kubectl create secret generic backend-secrets \
                              --from-env-file=$ENV_FILE_PATH \
                              --namespace=2401137 \
                              --dry-run=client -o yaml | kubectl apply -f -
                        '''
                    }
                }
            }
        }
                }
            }
        }
    }
}