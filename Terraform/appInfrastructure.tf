# provider "aws" {
#   region = "eu-central-1"
# }

# resource "aws_vpc" "main" {
#   cidr_block = "10.0.0.0/16"
# }

# resource "aws_subnet" "public_subnet1" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.1.0/24"
#   map_public_ip_on_launch = true
#   availability_zone = "eu-central-1a"
# }

# resource "aws_subnet" "public_subnet2" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.2.0/24"
#   map_public_ip_on_launch = true
#   availability_zone = "eu-central-1b"
# }

# resource "aws_subnet" "private_subnet1" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.3.0/24"
#   availability_zone = "eu-central-1a"
# }

# resource "aws_subnet" "private_subnet2" {
#   vpc_id            = aws_vpc.main.id
#   cidr_block        = "10.0.4.0/24"
#   availability_zone = "eu-central-1b"
# }

# resource "aws_internet_gateway" "gw" {
#   vpc_id = aws_vpc.main.id
# }

# resource "aws_route_table" "public_rt" {
#   vpc_id = aws_vpc.main.id
# }

# resource "aws_route" "default_route" {
#   route_table_id         = aws_route_table.public_rt.id
#   destination_cidr_block = "0.0.0.0/0"
#   gateway_id             = aws_internet_gateway.gw.id
# }

# resource "aws_route_table_association" "public_subnet1_assoc" {
#   subnet_id      = aws_subnet.public_subnet1.id
#   route_table_id = aws_route_table.public_rt.id
# }

# resource "aws_route_table_association" "public_subnet2_assoc" {
#   subnet_id      = aws_subnet.public_subnet2.id
#   route_table_id = aws_route_table.public_rt.id
# }

# resource "aws_security_group" "ecs_sg" {
#   vpc_id = aws_vpc.main.id

#   ingress {
#     from_port   = 80
#     to_port     = 80
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 8082
#     to_port     = 8082
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   ingress {
#     from_port   = 3000
#     to_port     = 3000
#     protocol    = "tcp"
#     cidr_blocks = ["0.0.0.0/0"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

# resource "aws_ecs_cluster" "mellowdreams-cluster" {
#   name = "mellowdreams-cluster"
# }

# resource "aws_ecs_task_definition" "frontend" {
#   family                   = "frontend"
#   network_mode             = "awsvpc"
#   requires_compatibilities = ["FARGATE"]
#   memory                   = "512"
#   cpu                      = "256"
#   execution_role_arn       = aws_iam_role.ecs_task_execution.arn

#   container_definitions = jsonencode([
#     {
#       name  = "frontend"
#       image = "frontend:latest"
#       cpu   = 256
#       memory = 512
#       portMappings = [{ containerPort = 3000 }]
#     }
#   ])
# }

# resource "aws_ecs_task_definition" "backend" {
#   family                   = "backend"
#   network_mode             = "awsvpc"
#   requires_compatibilities = ["FARGATE"]
#   memory                   = "512"
#   cpu                      = "256"
#   execution_role_arn       = aws_iam_role.ecs_task_execution.arn

#   container_definitions = jsonencode([
#     {
#       name  = "backend"
#       image = "backend:latest"
#       cpu   = 256
#       memory = 512
#       portMappings = [{ containerPort = 8082, hostPort = 8082 }]
#       environment = [
#         { name = "MONGO_URI", value = "mongodb://${GitHub.Secrets}:${GitHub.Secrets}@${aws_instance.mongodb.private_ip}:27017/database-name" }
#       ]
#     }
#   ])
# }

# resource "aws_ecs_service" "backend" {
#   name = "backend-service"
#   cluster = aws_ecs_cluster.mellowdreams-cluster.id
#   task_definition = aws_ecs_task_definition.backend.arn
#   launch_type = "FARGATE" 

#   network_configuration {
#     subnets = [aws_subnet.private_subnet2.id]
#     security_groups = [aws_security_group.ecs_sg.id]
#   }
# }

# resource "aws_ecs_service" "frontend" {
#   name            = "frontend-service"
#   cluster         = aws_ecs_cluster.mellowdreams-cluster.id
#   task_definition = aws_ecs_task_definition.frontend.arn
#   launch_type     = "FARGATE"

#   network_configuration {
#     subnets = [aws_subnet.private_subnet1.id]
#     security_groups = [aws_security_group.ecs_sg.id]
#   }
# }

# resource "aws_lb" "loadbalancer" {
#   name               = "mellowdreams-lb"
#   internal           = false
#   load_balancer_type = "application"
#   security_groups    = [aws_security_group.ecs_sg.id]
#   subnets           = [aws_subnet.public_subnet1.id, aws_subnet.public_subnet2.id]
# }

# resource "aws_lb_target_group" "ecs_target" {
#   name     = "ecs-target"
#   port     = 80
#   protocol = "HTTP"
#   vpc_id   = aws_vpc.main.id
#   target_type = "ip"
# }

# resource "aws_lb_listener" "http" {
#   load_balancer_arn = aws_lb.loadbalancer.arn
#   port             = 80
#   protocol         = "HTTP"

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.ecs_target.arn
#   }
# }

# resource "aws_iam_role" "ecs_task_execution" {
#   name = "ecsTaskExecutionRole"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Effect = "Allow"
#       Principal = { Service = "ecs-tasks.amazonaws.com" }
#       Action = "sts:AssumeRole"
#     }]
#   })
# }

# resource "aws_iam_policy_attachment" "ecs_task_execution_attach" {
#   name       = "ecsTaskExecutionRolePolicyAttachment"
#   roles      = [aws_iam_role.ecs_task_execution.id]
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
# }
