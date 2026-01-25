variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.small"
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "ami_id" {
  description = "Ubuntu AMI ID"
  default     = "ami-0030e4319cbf4dbf2"  # Ubuntu 22.04 LTS x86_64 in us-east-1
}

