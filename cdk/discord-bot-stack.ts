import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class DiscordBotStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.Vpc(this, 'DiscordBotVPC', {
      maxAzs: 2
    });

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'DiscordBotCluster', {
      vpc: vpc
    });

    cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      desiredCapacity: 1,
    });

    // Create Task Definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'DiscordBotTaskDef');

    // Add container to Task Definition
    const container = taskDefinition.addContainer('DiscordBotContainer', {
      image: ecs.ContainerImage.fromAsset('./'),
      memoryLimitMiB: 512,
      cpu: 256,
      environment: {
        CLIENT_ID: process.env.CLIENT_ID || '',
        GUILD_ID: process.env.GUILD_ID || '',
        BOT_TOKEN: process.env.BOT_TOKEN || ''
      }
    });

    // Create ECS Service
    new ecs.Ec2Service(this, 'DiscordBotService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      maxHealthyPercent: 200,
      minHealthyPercent: 50
    });

    // Add IAM role for ECS tasks
    const taskRole = new iam.Role(this, 'DiscordBotTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
    });

    // Add necessary permissions to the task role
    taskRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'));
  }
}
