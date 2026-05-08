export const CLOUD = {
  id: 3, title: 'Cloud Computing & DevOps', emoji: '☁️', level: 'Beginner → Advanced',
  pages: [
    { subtitle: '1. Cloud Computing Revolution', content: `Cloud computing is the on-demand delivery of IT resources over the internet with pay-as-you-go pricing.

**The Old Way (On-Premises)**
Companies bought physical servers, rented data center space, hired hardware engineers, guessed capacity needs months in advance. If traffic spiked, servers crashed. If traffic dropped, expensive hardware sat idle.

**The Cloud Way**
Rent computing resources by the second from massive data centers run by AWS, Azure, or GCP. Scale up instantly during peak traffic, scale down to zero when idle. Pay only for what you use.

**Cloud Service Models**
- IaaS (Infrastructure as a Service): Rent virtual machines, storage, networking. You manage the OS and everything above. Examples: AWS EC2, Azure VMs, Google Compute Engine.
- PaaS (Platform as a Service): Provider manages infrastructure and OS. You deploy code. Examples: Heroku, AWS Elastic Beanstalk, Google App Engine.
- SaaS (Software as a Service): Fully managed applications. Examples: Gmail, Salesforce, Slack, Notion.
- FaaS (Function as a Service): Serverless. Run individual functions. Examples: AWS Lambda, Azure Functions, Google Cloud Functions.

**Cloud Deployment Models**
- Public Cloud: Shared infrastructure, multi-tenant (AWS, Azure, GCP).
- Private Cloud: Dedicated infrastructure for one organization (OpenStack, VMware).
- Hybrid Cloud: Combination of public and private.
- Multi-Cloud: Using multiple cloud providers simultaneously.

**The Big Three**
- AWS (Amazon Web Services): 33% market share. Most services (200+). First mover.
- Azure (Microsoft): 22% market share. Strong enterprise/hybrid integration.
- GCP (Google Cloud): 10% market share. Best for AI/ML and data analytics.` },
    { subtitle: '2. Core Cloud Services', content: `Understanding the fundamental cloud services that power modern applications.

**Compute**
- Virtual Machines: EC2 (AWS), Compute Engine (GCP). Full OS control.
- Containers: ECS/EKS (AWS), GKE (GCP). Run Docker containers.
- Serverless: Lambda (AWS), Cloud Functions (GCP). No server management.

**Storage**
- Object Storage: S3 (AWS), Cloud Storage (GCP). Store any file (images, videos, backups). Virtually unlimited. $0.023/GB/month.
- Block Storage: EBS (AWS). Attach virtual hard drives to VMs.
- File Storage: EFS (AWS), Filestore (GCP). Shared file systems.

**Databases**
- Relational (SQL): RDS (AWS), Cloud SQL (GCP). PostgreSQL, MySQL.
- NoSQL: DynamoDB (AWS), Firestore (GCP). Key-value, document stores.
- In-Memory: ElastiCache (AWS), Memorystore (GCP). Redis, Memcached.

**Networking**
- VPC (Virtual Private Cloud): Your isolated network in the cloud.
- Load Balancers: Distribute traffic across multiple instances.
- CDN (Content Delivery Network): CloudFront (AWS), Cloud CDN (GCP). Cache content at edge locations worldwide for low latency.
- DNS: Route 53 (AWS), Cloud DNS (GCP).

**Security & Identity**
- IAM (Identity and Access Management): Control who can access what.
- KMS (Key Management Service): Manage encryption keys.
- WAF (Web Application Firewall): Filter malicious web traffic.
- Security Groups / Firewall Rules: Control network access to instances.` },
    { subtitle: '3. Docker & Containers', content: `Docker revolutionized software deployment by solving the "it works on my machine" problem.

**What is a Container?**
A container packages application code, runtime, libraries, and dependencies into a single unit that runs consistently anywhere — developer laptop, test server, production cloud.

**Containers vs Virtual Machines**
- VMs: Each VM runs a full OS. Heavy (GBs), slow to start (minutes).
- Containers: Share the host OS kernel. Lightweight (MBs), start in seconds.

**Dockerfile — Building Images**
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

**Essential Docker Commands**
docker build -t myapp .
docker run -p 3000:3000 myapp
docker ps                    # List running containers
docker stop <container_id>
docker images                # List images
docker-compose up -d         # Start multi-container app

**Docker Compose — Multi-Container Apps**
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:

**Container Registries**
- Docker Hub: Public registry. Pull official images (node, postgres, nginx).
- ECR (AWS), GCR (GCP), ACR (Azure): Private registries.

**Best Practices**
- Use multi-stage builds to minimize image size.
- Never store secrets in Dockerfiles.
- Use .dockerignore to exclude unnecessary files.
- Pin specific versions (node:18.17.0, not node:latest).` },
    { subtitle: '4. Kubernetes (K8s)', content: `Kubernetes is the industry-standard container orchestration platform, originally developed by Google.

**Why Kubernetes?**
When running hundreds of containers across many servers, you need automated management: scheduling, scaling, health monitoring, networking, and rolling updates.

**Core Concepts**
- Pod: Smallest deployable unit. Contains one or more containers.
- Deployment: Manages Pod replicas and rolling updates.
- Service: Stable network endpoint for a set of Pods (ClusterIP, NodePort, LoadBalancer).
- Namespace: Virtual cluster for resource isolation.
- ConfigMap/Secret: External configuration and sensitive data.
- Ingress: HTTP routing and TLS termination.

**Deployment YAML**
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: myapp:1.0
        ports:
        - containerPort: 3000
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"

**Key Features**
- Auto-scaling: HPA (Horizontal Pod Autoscaler) scales pods based on CPU/memory.
- Self-healing: Automatically restarts crashed containers.
- Rolling Updates: Zero-downtime deployments.
- Service Discovery: Pods find each other via DNS.

**Managed Kubernetes**
- EKS (AWS), GKE (GCP), AKS (Azure): Cloud providers manage the control plane.` },
    { subtitle: '5. CI/CD Pipelines', content: `Continuous Integration and Continuous Deployment automate the journey from code commit to production.

**Continuous Integration (CI)**
Every code commit triggers automated:
1. Code compilation/build.
2. Unit tests, integration tests.
3. Code quality analysis (linting, static analysis).
4. Security scanning (dependency vulnerabilities).

**Continuous Deployment (CD)**
If all CI checks pass, automatically deploy to production.
- Blue-Green Deployment: Run two identical environments. Switch traffic instantly.
- Canary Deployment: Route 5% of traffic to the new version. Monitor. Gradually increase.
- Rolling Update: Replace instances one by one.

**GitHub Actions Example**
name: CI/CD Pipeline
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm test
      - run: npm run build
      - name: Deploy to AWS
        run: aws s3 sync build/ s3://my-bucket

**Other CI/CD Tools**
- Jenkins: Self-hosted, highly customizable.
- GitLab CI: Built into GitLab.
- CircleCI: Cloud-native CI/CD.
- ArgoCD: GitOps-based continuous deployment for Kubernetes.

**GitOps**
The entire system state is defined in Git. Changes to infrastructure happen through pull requests, not manual commands. ArgoCD watches the Git repo and automatically syncs the cluster state.` },
    { subtitle: '6. Infrastructure as Code', content: `IaC treats infrastructure like software — version-controlled, tested, and reproducible.

**Terraform (HashiCorp)**
The industry standard for multi-cloud IaC.

resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"
  tags = {
    Name = "WebServer"
  }
}

resource "aws_s3_bucket" "assets" {
  bucket = "my-app-assets"
}

**Terraform Workflow**
terraform init      # Download provider plugins
terraform plan      # Preview changes
terraform apply     # Apply changes
terraform destroy   # Tear down infrastructure

**Key Concepts**
- State: Terraform tracks what infrastructure exists in a state file.
- Modules: Reusable infrastructure components.
- Variables: Parameterize configurations.
- Remote State: Store state in S3/GCS for team collaboration.

**Configuration Management**
- Ansible: Agentless. Uses SSH. YAML playbooks for server configuration.
- Chef/Puppet: Agent-based. Ruby DSL. For complex environments.

**Ansible Playbook Example**
- hosts: webservers
  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present
    - name: Start Nginx
      service:
        name: nginx
        state: started
        enabled: true

**Benefits of IaC**
- Reproducibility: Spin up identical environments in minutes.
- Version Control: Track every infrastructure change in Git.
- Automation: No manual clicking through cloud consoles.
- Documentation: The code IS the documentation.` },
    { subtitle: '7. Monitoring & Observability', content: `You cannot fix what you cannot see. Monitoring is critical for production systems.

**The Three Pillars of Observability**

**1. Metrics**
Numerical measurements over time.
- CPU usage, memory, disk I/O, request count, error rate, response time.
- Tools: Prometheus (collection), Grafana (visualization).
- Prometheus scrapes metrics from applications every 15 seconds.

**2. Logs**
Detailed event records from applications and systems.
- Structured logging (JSON format) for machine parsing.
- Centralized log aggregation: ELK Stack (Elasticsearch, Logstash, Kibana), Loki.
- Log levels: DEBUG, INFO, WARN, ERROR, FATAL.

**3. Traces**
Follow a single request through a distributed system (across microservices).
- Distributed tracing shows exactly where latency occurs.
- Tools: Jaeger, Zipkin, OpenTelemetry.

**Alerting**
- Set thresholds: Alert if error rate > 5%, if response time > 500ms.
- PagerDuty, OpsGenie: On-call rotation and incident management.
- Runbooks: Documented steps to diagnose and resolve common alerts.

**SLOs, SLIs, SLAs**
- SLI (Service Level Indicator): Measurable metric (e.g., 99.5% of requests < 200ms).
- SLO (Service Level Objective): Target for an SLI (e.g., 99.9% availability).
- SLA (Service Level Agreement): Contract with customers. Financial penalties if not met.

**Chaos Engineering**
Intentionally inject failures to test system resilience:
- Netflix Chaos Monkey: Randomly kills production instances.
- Identifies weaknesses before real outages occur.` },
    { subtitle: '8. Microservices Architecture', content: `Microservices decompose a monolithic application into small, independently deployable services.

**Monolith vs Microservices**
- Monolith: One codebase, one deployment. Simple but becomes unwieldy at scale.
- Microservices: Each service handles one business capability. Independent deployment, scaling, and technology choices.

**Key Principles**
- Single Responsibility: Each service does one thing well.
- Loose Coupling: Services communicate through well-defined APIs.
- Independent Deployment: Deploy one service without affecting others.
- Decentralized Data: Each service owns its database.

**Communication Patterns**
- Synchronous: REST APIs, gRPC. Request-response.
- Asynchronous: Message queues (RabbitMQ, SQS), event streaming (Kafka). Fire-and-forget.

**API Gateway**
Single entry point for all client requests:
- Routes requests to appropriate microservices.
- Handles authentication, rate limiting, caching.
- Tools: Kong, AWS API Gateway, Nginx.

**Service Mesh**
Infrastructure layer for service-to-service communication:
- Handles mTLS encryption, load balancing, retries, circuit breaking.
- Istio, Linkerd: Sidecar proxy pattern.

**Challenges**
- Distributed complexity: Network failures, data consistency.
- Debugging: Tracing requests across 20+ services.
- Data management: Eventual consistency vs strong consistency.
- Organizational: Requires team autonomy (Conway's Law).

**When to Use Microservices**
- Large teams (multiple independent squads).
- Services need different scaling characteristics.
- Different technology requirements per service.
- DON'T start with microservices. Start monolith, extract when needed.` },
    { subtitle: '9. Serverless & Edge', content: `Serverless computing abstracts away all infrastructure management. You write functions; the cloud handles everything else.

**How Serverless Works**
1. You write a function (e.g., processPayment).
2. Upload it to AWS Lambda / Google Cloud Functions.
3. It runs ONLY when triggered (HTTP request, database change, scheduled event).
4. Scales automatically from 0 to thousands of concurrent executions.
5. You pay per invocation and per millisecond of compute time.

**AWS Lambda Example**
exports.handler = async (event) => {
  const name = event.queryStringParameters?.name || 'World';
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello " + name })
  };
};

**Serverless Benefits**
- Zero server management.
- Pay-per-use (can be nearly free for low-traffic apps).
- Automatic scaling (0 to millions of requests).
- Built-in high availability.

**Serverless Limitations**
- Cold Starts: First invocation takes longer (100ms-1s).
- Execution Time Limits: 15 minutes max on Lambda.
- Stateless: Functions don't persist data between invocations.
- Vendor Lock-in: Code tied to specific cloud provider.

**Edge Computing**
Run code at CDN edge locations closest to users:
- Cloudflare Workers, AWS CloudFront Functions, Vercel Edge Functions.
- Ultra-low latency (< 50ms globally).
- Use cases: A/B testing, authentication, geolocation-based routing.

**Serverless Frameworks**
- Serverless Framework, AWS SAM, SST.
- Define infrastructure alongside code.` },
    { subtitle: '10. Cloud & DevOps Career Guide', content: `Cloud and DevOps engineers are among the highest-paid and most in-demand roles in tech.

**Career Paths**

**Cloud Engineer ($90K-$160K)**
Design and manage cloud infrastructure. IAM, networking, security.

**DevOps Engineer ($100K-$180K)**
Build CI/CD pipelines, manage Kubernetes, automate everything.

**Site Reliability Engineer — SRE ($120K-$220K)**
Coined by Google. Apply software engineering to operations. Focus on reliability, scalability, and incident management.

**Platform Engineer ($120K-$200K)**
Build internal developer platforms. Golden paths for developers.

**Solutions Architect ($130K-$250K)**
Design cloud architectures for enterprise clients.

**Certifications**
- AWS: Cloud Practitioner → Solutions Architect Associate → Professional
- Azure: AZ-900 → AZ-104 → AZ-305
- GCP: Cloud Digital Leader → Associate Cloud Engineer → Professional
- Kubernetes: CKA (Certified Kubernetes Administrator), CKAD
- Terraform: HashiCorp Certified Terraform Associate

**Learning Path**
1. Learn Linux administration thoroughly.
2. Get comfortable with Git and GitHub.
3. Learn Docker (build, run, compose).
4. Deploy apps to AWS/GCP free tier.
5. Learn Kubernetes basics (Minikube).
6. Build a CI/CD pipeline (GitHub Actions).
7. Learn Terraform for IaC.
8. Get AWS Solutions Architect Associate cert.

**Top Resources**
- A Cloud Guru, KodeKloud, Adrian Cantrill
- Docker and Kubernetes: The Complete Guide (Udemy)
- AWS Well-Architected Framework (official)
- 12factor.net (app design methodology)` }
  ]
};
