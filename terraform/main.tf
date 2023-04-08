terraform {
  required_version = ">= 0.13"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.61.0"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}


resource "aws_subnet" "public" {
  cidr_block              = "10.0.1.0/24"
  vpc_id                  = aws_vpc.main.id
  availability_zone       = "ca-central-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "public_b" {
  cidr_block        = "10.0.2.0/24"
  vpc_id            = aws_vpc.main.id
  availability_zone = "ca-central-1b"
  map_public_ip_on_launch = true

}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "main" {
  name_prefix = "main-sg"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.main.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

# resource "aws_internet_gateway_attachment" "igw_attachment" {
#   vpc_id             = aws_vpc.main.id
#   internet_gateway_id = aws_internet_gateway.main.id
#   depends_on = [
#     aws_internet_gateway.main,
#   ]
# }

resource "aws_ecs_cluster" "main" {
  name = "my-cluster"
}

# module "api" {
#   source = "git::https://github.com/cloudposse/terraform-aws-ecs-container-definition.git?ref=tags/0.23.0"
#   container_name = "api"
#   container_image = "099920234029.dkr.ecr.ca-central-1.amazonaws.com/booking-app:latest"
# }
resource "aws_ecs_task_definition" "main" {
  family = "my-task-definition"
  container_definitions = jsonencode([{
    name  = "my-container"
    image = "099920234029.dkr.ecr.ca-central-1.amazonaws.com/booking-app:latest"
    portMappings = [{
      containerPort = 4000
      protocol      = "tcp"
    },
    {
      containerPort = 5173
      protocol      = "tcp"
    }]
    environment = [
      { name = "MONGO_URL", value = var.MONGO_URL },
      { name = "JWT_SECRET", value = var.JWT_SECRET },
      { name = "S3_ACCESS_KEY", value = var.S3_ACCESS_KEY },
      { name = "S3_SECRET_ACCESS_KEY", value = var.S3_SECRET_ACCESS_KEY },
      { name = "HOST_URL", value = var.HOST_URL },
      { name = "VITE_API_BASE_URL", value = var.VITE_API_BASE_URL },
    ]
  }])
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  execution_role_arn = aws_iam_role.ecs_execution_role.arn
}

resource "aws_ecs_service" "main" {
  name            = "my-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 1

  network_configuration {
    subnets          = [aws_subnet.public.id, aws_subnet.public_b.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.main.id]
  }

  platform_version = "LATEST"
  launch_type      = "FARGATE"


  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "my-container"
    container_port   = 4000
  }
}

resource "aws_lb" "main" {
  name               = "my-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public.id, aws_subnet.public_b.id]
  security_groups    = [aws_security_group.main.id]

  tags = {
    Name = "my-alb"
  }
}

resource "aws_lb_target_group" "main" {
  name_prefix          = "my-tg"
  port                 = 80
  protocol             = "HTTP"
  vpc_id               = aws_vpc.main.id
  target_type          = "ip"
  deregistration_delay = 10

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    interval            = 30
    timeout             = 5
    path                = "/"
    port                = "traffic-port"
  }

  depends_on = [
    aws_lb.main,
  ]
}

resource "aws_lb_listener" "main" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}


resource "aws_alb_listener_rule" "main" {
  listener_arn = aws_lb_listener.main.arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}