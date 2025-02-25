# provider "aws" {
#   region = "eu-central-1"
# }

# resource "aws_vpc" "main" {
#   cidr_block = "10.0.0.0/16"
# }

# resource "aws_subnet" "public_subnet1" {
#   vpc_id = aws_vpc.main.id
#   cidr_block = "10.0.1.0/24"
#   map_public_ip_on_launch = true
#   availability_zone = "eu-central-1a"
# }

# resource "aws_subnet" "public_subnet2" {
#   vpc_id = aws_vpc.main.id
#   cidr_block = "10.0.2.0/24"
#   map_public_ip_on_launch = true
#   availability_zone = "eu-central-1b"
# }

# resource "aws_subnet" "private_subnet1" {
#     vpc_id = aws_vpc.main.id
#     cidr_block = "10.0.3.0/24"
#     availability_zone = "eu-central-1a"  
# }

# resource "aws_subnet" "private_subnet2" {
#     vpc_id = aws_vpc.main.id
#     cidr_block = "10.0.4.0/24"
#     availability_zone = "eu-central-1b"  
# }

# resource "aws_docdb_subnet_group" "docdb_subnet_group" {
#   name       = "docdb-subnet-group"
#   subnet_ids = [aws_subnet.private_subnet1.id, aws_subnet.private_subnet2.id] 
# }

# resource "aws_internet_gateway" "gw" {
#   vpc_id = aws_vpc.main.id
# }

# resource "aws_route_table" "public_rt" {
#     vpc_id = aws_vpc.main.id  
# }

# resource "aws_route" "default_route" {
#     route_table_id = aws_route_table.public_rt.id
#     destination_cidr_block = "0.0.0.0/0"
#     gateway_id = aws_internet_gateway.gw.id  
# }

# resource "aws_security_group" "docdb_sg" {
#     vpc_id = aws_vpc.main.id

#     ingress {
#         from_port = 27017
#         to_port = 27017
#         protocol = "tcp"
#         cidr_blocks = ["10.0.0.0/16"]
#     }
# }

# resource "aws_security_group" "ecs_sg" {
#     vpc_id = aws_vpc.main.id

#     ingress {
#         from_port = "80"
#         to_port = "80"
#         protocol = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     }

#     ingress {
#         from_port = 8082
#         to_port = 8082
#         protocol = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     }

#     ingress {
#         from_port = 3000
#         to_port = 3000
#         protocol = "tcp"
#         cidr_blocks = ["0.0.0.0/0"]
#     } 
# }

# resource "aws_ecs_cluster" "mellowdreams-cluster" {
#     name = "mellowdreams-cluster"
  
# }

# resource "aws_ecs_task_definition" "frontend" {
#     family = "frontend"
#     network_mode = "awsvpc"
#     requires_compatibilities = ["FARGATE"]
#     memory = "512"
#     cpu = "256"
#     execution_role_arn = aws_iam_role.ecs_task_execution.arn

#     container_definitions = jsonencode([
#         {
#             name = "frontend"
#             image = "frontend:latest"
#             cpu = 256
#             memory = 512
#             portMappings = [{ containerPort = 3000, hostPort = 3000 }]
#         }
#     ])  
# }

# resource "aws_ecs_service" "frontend" {
#     name = "frontend-service"
#     cluster = aws_ecs_cluster.mellowdreams-cluster.id
#     task_definition = aws_ecs_task_definition.frontend.arn
#     launch_type = "FARGATE"
#     network_configuration {
#         subnets = [aws_subnet.private_subnet1.id]
#         security_groups = [aws_security_group.ecs_sg.id]
#     }
# }

# resource "aws_iam_role" "ecs_task_execution" {
#   name = "ecsTaskExecutionRole"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Effect = "Allow"
#       Principal = {
#         Service = "ecs-tasks.amazonaws.com"
#       }
#       Action = "sts:AssumeRole"
#     }]
#   })
# }

# resource "aws_iam_policy" "sts_policy" {
#   name        = "GetCallerIdentityPolicy"
#   description = "Allows calling STS GetCallerIdentity"
#   policy      = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect   = "Allow",
#         Action   = "sts:GetCallerIdentity",
#         Resource = "*"
#       }
#     ]
#   })
# }

# resource "aws_iam_policy_attachment" "ecs_task_execution_attach" {
#   name       = "ecsTaskExecutionRolePolicyAttachment"
#   roles      = [aws_iam_role.ecs_task_execution.name]
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
# }

# resource "aws_ecs_task_definition" "backend" {
#     family = "backend"
#     network_mode = "awsvpc"
#     requires_compatibilities = ["FARGATE"]
#     memory = "512"
#     cpu = "256"
#     execution_role_arn = aws_iam_role.ecs_task_execution.arn
    
#     container_definitions = jsonencode([
#         {
#             name = "backend"
#             image = "backend:latest"
#             cpu = 256
#             memory = 512
#             portMappings = [{ containerPort = 8082, hostPort = 8082}]
#             environment = [{ name = "DB_URI", value = "mongodb://mellowdreams-admin:bhYIrO5Eu35xyAel@${mongodbatlas_cluster.mellowdreams-cluster.connection_strings.standard}/mellowdreams" }] //aws_docdb_cluster.docdb.endpoint }]  
#         }
#     ])
# }

# resource "aws_ecs_service" "backend" {
#     name = "backend-service"
#     cluster = aws_ecs_cluster.mellowdreams-cluster.id
#     task_definition = aws_ecs_task_definition.backend.arn
#     launch_type = "FARGATE"
#     network_configuration {
#         subnets = [aws_subnet.private_subnet1.id]
#         security_groups = [aws_security_group.ecs_sg.id]
#     }
# }

# resource "aws_ecs_service" "mongodb" {
#   name            = "mongodb"
#   cluster         = aws_ecs_cluster.main.id
#   task_definition = aws_ecs_task_definition.mongodb.arn
#   desired_count   = 1
#   launch_type     = "FARGATE"

#   network_configuration {
#     subnets          = var.private_subnet_ids
#     security_groups  = [aws_security_group.ecs_sg.id]
#     assign_public_ip = false
#   }
# }

# resource "aws_ecs_task_definition" "mongodb" {
#   family                   = "mongodb"
#   network_mode             = "awsvpc"
#   requires_compatibilities = ["FARGATE"]
#   memory                   = "1024"
#   cpu                      = "512"
#   execution_role_arn       = aws_iam_role.ecs_task_execution.arn

#   volume {
#     name = "mongodb-storage"
#     efs_volume_configuration {
#       file_system_id = aws_efs_file_system.mongodb_efs.id
#       transit_encryption = "ENABLED"
#     }
#   }

#   container_definitions = jsonencode([
#     {
#       name  = "mongodb"
#       image = "mongo:latest"
#       cpu   = 512
#       memory = 1024
#       essential = true
#       portMappings = [{ containerPort = 27017, hostPort = 27017 }]
#       environment = [
#         { name = "MONGO_INITDB_ROOT_USERNAME", value = "demo" },
#         { name = "MONGO_INITDB_ROOT_PASSWORD", value = "demoDemodemo" }
#       ]
#       mountPoints = [
#         {
#           sourceVolume = "mongodb-storage"
#           containerPath = "/data/db"
#         }
#       ]
#     }
#   ])
# }

# resource "aws_efs_file_system" "mongodb_efs" {
#   creation_token = "mongodb-efs"
#   performance_mode = "generalPurpose"
#   throughput_mode = "bursting"

#   tags = {
#     Name = "MongoDB-EFS"
#   }
# }

# resource "aws_efs_mount_target" "mongodb_mount" {
#   count           = length(var.private_subnet_ids)
#   file_system_id  = aws_efs_file_system.mongodb_efs.id
#   subnet_id       = var.private_subnet_ids[count.index]
#   security_groups = [aws_security_group.efs_sg.id]
# }

# resource "aws_security_group" "efs_sg" {
#   name        = "efs-security-group"
#   description = "Allow NFS traffic for MongoDB EFS"
#   vpc_id      = var.vpc_id

#   ingress {
#     from_port   = 2049
#     to_port     = 2049
#     protocol    = "tcp"
#     cidr_blocks = ["10.0.0.0/16"]
#   }

#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
# }

# resource "aws_lb" "loadbalancer" {
#     name = "mellowdreams-lb"
#     internal = false
#     load_balancer_type = "application"
#     security_groups = [aws_security_group.ecs_sg.id]
#     subnets = [aws_subnet.public_subnet1.id, aws_subnet.public_subnet2.id]
# }

# resource "aws_lb_listener" "http" {
#     load_balancer_arn = aws_lb.loadbalancer.arn
#     port = 80
#     protocol = "HTTP"

#     default_action {
#         type = "fixed-response"
#         fixed_response {
#             content_type = "text/plain"
#             message_body = "404 Not Found"
#             status_code = "404"
#         }
#     }
# }
