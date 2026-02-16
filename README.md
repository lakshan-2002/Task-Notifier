# TaskNotifier - Daily Task Reminder System with Email Notifications


A daily task reminder system with automated email notifications, featuring Spring Boot backend, React frontend, and complete DevOps automation using Jenkins, Docker, Terraform, Ansible and AWS(EC2).

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Infrastructure Setup](#infrastructure-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [CI/CD Pipeline Optimization](#cicd-pipeline-optimization)
- [Additional Resources](#additional-resources)

---

## 🎯 Project Overview

TaskNotifier is a full-stack task management application with automated deployment capabilities. The project demonstrates modern DevOps practices including:

- Automated infrastructure provisioning with Terraform
- Configuration management with Ansible
- Containerization with Docker
- CI/CD pipeline with Jenkins
- Multi-stage Docker builds for optimized images
- Automated email notifications via SendGrid

### Key Features

- ✅ User authentication and profile management
- ✅ Task creation, editing, and completion tracking
- ✅ Dashboard with visual analytics
- ✅ Scheduled daily email notifications
- ✅ RESTful API backend
- ✅ Responsive React frontend
- ✅ Fully automated deployment pipeline

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Jenkins   │─────▶│  DockerHub   │─────▶│  AWS EC2    │
│   Server    │      │  Registry    │      │  Instance   │
└─────────────┘      └──────────────┘      └─────────────┘
       │                                            │
       │                                            ▼
       │                                    ┌───────────────┐
       └───────────────────────────────────▶│   Ansible     │
                                            │   Playbook    │
                                            └───────────────┘
                                                    │
                                    ┌───────────────┴───────────────┐
                                    ▼                               ▼
                            ┌──────────────┐              ┌──────────────┐
                            │   Frontend   │              │   Backend    │
                            │  (Port 5173) │◀────────────▶│ (Port 8080)  │
                            └──────────────┘              └──────────────┘
                                                                  │
                                                                  ▼
                                                          ┌──────────────┐
                                                          │    MySQL     │
                                                          │   Database   │
                                                          └──────────────┘
```

### Deployment Flow

1. **Code Push**: Developer pushes code to repository
2. **Build Stage**: Jenkins builds Docker images with layer caching
3. **Push Stage**: Images pushed to DockerHub registry
4. **Inventory Generation**: Dynamic inventory file created with EC2 instance IP
5. **Ansible Deployment**: Playbook deploys containers to EC2
6. **Health Check**: Automated verification of deployed services
7. **Notification**: Pipeline completion status displayed

---

## 💻 Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.5
- **Language**: Java 17
- **Build Tool**: Maven 3.8.6
- **Database**: MySQL
- **Email Service**: SendGrid API
- **Container**: Docker (Multi-stage build)

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **UI Library**: Lucide React
- **Charts**: Recharts 3.3.0
- **HTTP Client**: Axios 1.12.2
- **Routing**: React Router DOM 7.9.1
- **Notifications**: React Toastify 11.0.5

### DevOps & Infrastructure
- **CI/CD**: Jenkins
- **IaC**: Terraform 5.0
- **Configuration Management**: Ansible
- **Containerization**: Docker with BuildKit
- **Container Registry**: DockerHub
- **Cloud Provider**: AWS (EC2)
- **Operating System**: Ubuntu (on EC2)

---

## 📦 Prerequisites

### Required Software

1. **Jenkins Server**
   - Jenkins 2.x or later
   - Docker installed on Jenkins server
   - Required Jenkins plugins:
     - Docker Pipeline
     - SSH Agent Plugin
     - Credentials Plugin
     - Git Plugin

2. **Local Development**
   - Java 17+
   - Maven 3.8+
   - Node.js 24+
   - Docker & Docker Compose
   - Git

3. **Cloud Services**
   - AWS Account with EC2 access
   - DockerHub account
   - SendGrid account (for email features)

### Required Credentials

Set up the following credentials in Jenkins:

| Credential ID | Type | Description |
|--------------|------|-------------|
| `dockerhub-creds` | Username/Password | DockerHub credentials |
| `aws-credentials` | AWS Credentials | AWS access keys |
| `aws-ssh-key` | SSH Username with Private Key | EC2 SSH key pair |
| `db-url` | Secret Text | MySQL database JDBC URL |
| `db-username` | Secret Text | Database username |
| `db-password` | Secret Text | Database password |
| `sendgrid-api-key` | Secret Text | SendGrid API key |

---

## 🚀 Infrastructure Setup

### 1. Provision AWS Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars from template
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your values
# Required variables:
# - aws_region
# - key_name
# - ami_id
# - instance_type

# Plan infrastructure changes
terraform plan

# Apply infrastructure
terraform apply

# Save the instance IP
terraform output instance_ip > instance_ip.txt
```

### 2. Terraform Configuration

The infrastructure includes:
- EC2 instance with Ubuntu
- Security group with ports: 22 (SSH), 80 (HTTP), 5173 (Frontend), 8080 (Backend)
- Key pair for SSH access
- Public IP assignment

**Important Files:**
- `main.tf` - Main infrastructure definition
- `variables.tf` - Variable definitions
- `outputs.tf` - Output definitions
- `terraform.tfvars` - Your configuration values (git-ignored)
- `terraform.tfvars.example` - Template for configuration

### 3. Update Jenkins Pipeline

Update the `INSTANCE_IP` in the Jenkinsfile:

```groovy
environment {
    INSTANCE_IP = 'YOUR_EC2_PUBLIC_IP'
    // ... other environment variables
}
```

---

## 🔄 CI/CD Pipeline

### Jenkins Pipeline Stages

#### 1. **Checkout**
- Pulls latest code from repository
- Uses SCM configuration

#### 2. **Build Images**
- Builds Docker images with BuildKit
- Uses layer caching for faster builds
- Creates both backend and frontend images
- Tags: `lakshan2002/tasknotifier-backend:latest` and `lakshan2002/tasknotifier-frontend:latest`

**Backend Docker Build:**
```dockerfile
# Multi-stage build
Stage 1: Maven build with dependency caching
Stage 2: Lightweight runtime image
```

**Frontend Docker Build:**
```dockerfile
# Node.js Alpine image
# Uses npm ci for consistent installs
# Runs Vite dev server
```

#### 3. **Push Images**
- Authenticates with DockerHub
- Pushes images to registry
- Cleans up credentials after push

#### 4. **Generate Inventory File**
- Creates dynamic Ansible inventory
- Injects EC2 instance IP
- Configures SSH settings
- Stored at: `/tmp/ansible/inventory.ini`

#### 5. **Deploy Ansible Playbook**
- Runs Ansible playbook
- Deploys containers to EC2
- Passes environment variables securely
- Tests connectivity before deployment

#### 6. **Health Check**
- Waits 30 seconds for services to start
- Checks backend and frontend endpoints
- Reports status

#### 7. **Display URLs**
- Shows deployment URLs
- Frontend: `http://<IP>:5173`
- Backend: `http://<IP>:8080`
- Health: `http://<IP>:8080/actuator/health`

### Pipeline Configuration

```groovy
// Environment Variables
DOCKERHUB_CREDS        // DockerHub credentials
AWS_CREDENTIALS        // AWS access keys
DB_URL                 // Database connection string
DB_USERNAME            // Database user
DB_PASSWORD            // Database password
SENDGRID_API_KEY       // SendGrid API key
INSTANCE_IP            // EC2 public IP
```

---

## 🔧 Local Development

### Backend Development

```bash
# Clone repository
git clone <repository-url>
cd TaskNotifier

# Set environment variables
export Database_Host=jdbc:mysql://localhost:3306/task_notifier
export Database_Username=root
export Database_Password=your_password
export SENDGRID_API_KEY=your_sendgrid_key

# Build with Maven
mvn clean package

# Run application
java -jar target/TaskNotifier-0.0.1-SNAPSHOT.jar

# Or use Maven
mvn spring-boot:run
```

**Backend runs on**: `http://localhost:8080`

### Frontend Development

```bash
cd ReactApp

# Install dependencies
npm install

# Set environment variables
export VITE_API_URL=http://localhost:8080

# Run development server
npm run dev

# Build for production
npm run build
```

**Frontend runs on**: `http://localhost:5173`

### Docker Development

```bash
# Build images locally
docker build -t tasknotifier-backend:dev -f Dockerfile .
docker build -t tasknotifier-frontend:dev ReactApp/

# Run with Docker Compose (if you create docker-compose.yml)
docker-compose up -d

# View logs
docker logs -f tasknotifier-backend
docker logs -f tasknotifier-frontend
```

---

## 📤 Deployment

### Automated Deployment (Recommended)

1. **Push Code to Repository**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Trigger Jenkins Pipeline**
   - Jenkins automatically triggers on push (if webhook configured)
   - Or manually trigger from Jenkins dashboard

3. **Monitor Pipeline**
   - Watch Jenkins console output
   - Check each stage completion
   - Verify health checks pass

4. **Access Application**
   - Frontend: `http://<INSTANCE_IP>:5173`
   - Backend API: `http://<INSTANCE_IP>:8080`

### Manual Deployment with Ansible

```bash
# Navigate to ansible directory
cd ansible

# Export required environment variables
export DB_URL="jdbc:mysql://your-db:3306/task_notifier"
export DB_USERNAME="your_username"
export DB_PASSWORD="your_password"
export SENDGRID_API_KEY="your_api_key"

# Run playbook
ansible-playbook -i inventory.ini deploy-playbook.yml \
    --user=ubuntu \
    --private-key=/path/to/your-key.pem
```

### Ansible Playbook Features

The `deploy-playbook.yml` includes:
- ✅ Docker installation (if not present)
- ✅ User group configuration
- ✅ Container cleanup (old deployments)
- ✅ Image pulling with retries
- ✅ Container deployment with environment variables
- ✅ Health checks and wait conditions
- ✅ Deployment summary

---


## 📁 Project Structure

```
TaskNotifier/
├── ansible/
│   ├── deploy-playbook.yml        # Ansible deployment playbook
│   ├── inventory.ini              # Ansible inventory (git-ignored)
│   └── inventory.ini.template     # Inventory template
│
├── ReactApp/                      # Frontend application
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   ├── Login.jsx              # Login component
│   │   ├── Signup.jsx             # Signup component
│   │   ├── Dashboard.jsx          # Dashboard component
│   │   ├── AddTask.jsx            # Add task component
│   │   ├── AllTasks.jsx           # Task list component
│   │   ├── CompletedTasks.jsx     # Completed tasks view
│   │   ├── Profile.jsx            # User profile
│   │   └── components/
│   │       ├── Sidebar.jsx        # Navigation sidebar
│   │       ├── Charts.jsx         # Analytics charts
│   │       ├── EditTask.jsx       # Task editor
│   │       └── OverviewCards.jsx  # Dashboard cards
│   ├── public/
│   ├── Dockerfile                 # Frontend Docker image
│   ├── package.json               # Node dependencies
│   └── vite.config.js             # Vite configuration
│
├── src/main/                      # Backend application
│   ├── java/com/lakshan/
│   │   ├── TaskNotifierApplication.java
│   │   ├── config/
│   │   │   └── CorsConfig.java    # CORS configuration
│   │   ├── controller/
│   │   │   ├── TaskController.java
│   │   │   ├── UserController.java
│   │   │   └── UserProfileController.java
│   │   ├── entity/
│   │   │   ├── Task.java
│   │   │   ├── User.java
│   │   │   └── UserProfile.java
│   │   ├── repository/
│   │   │   ├── TaskRepository.java
│   │   │   ├── UserRepository.java
│   │   │   └── UserProfileRepository.java
│   │   └── service/
│   │       ├── DailyEmailScheduler.java
│   │       └── EmailService.java
│   └── resources/
│       └── application.properties  # Application configuration
│
├── terraform/                     # Infrastructure as Code
│   ├── main.tf                    # Main infrastructure definition
│   ├── variables.tf               # Variable definitions
│   ├── outputs.tf                 # Output definitions
│   ├── terraform.tfvars           # Your values (git-ignored)
│   └── terraform.tfvars.example   # Configuration template
│
├── Dockerfile                     # Backend Docker image
├── Jenkinsfile                    # CI/CD pipeline definition
├── pom.xml                        # Maven configuration
├── mvnw                           # Maven wrapper (Unix)
├── mvnw.cmd                       # Maven wrapper (Windows)
└── README.md                      # This file
```

---


## 📝 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/completed` - Get completed tasks

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

---

## 🔄 CI/CD Pipeline Optimization

### Docker Layer Caching

The pipeline implements several caching strategies:

1. **Pull Previous Images**: Before building, pulls latest images
2. **BuildKit Cache**: Uses `--cache-from` for layer reuse
3. **Inline Cache**: Stores cache in image metadata

### Maven Dependency Caching

The backend Dockerfile:
1. Copies `pom.xml` first
2. Runs `mvn dependency:go-offline`
3. Then copies source code
4. This caches dependencies separately from code

### NPM Dependency Caching

The frontend Dockerfile:
1. Copies `package*.json` first
2. Runs `npm ci` for consistent installs
3. Then copies application code

---

## 📚 Additional Resources

### Documentation
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Ansible Documentation](https://docs.ansible.com)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Documentation](https://docs.docker.com)

### Tutorials
- [Spring Boot Tutorial](https://spring.io/guides)
- [React Tutorial](https://react.dev/learn)
- [Terraform Getting Started](https://learn.hashicorp.com/terraform)
- [Ansible Getting Started](https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html)

---


**Happy DevOps! 🚀**
