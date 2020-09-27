import { Construct, Stack, StackProps, CfnOutput } from "@aws-cdk/core";
import {
  Cluster,
  FargateTaskDefinition,
  ContainerImage,
  FargateService,
  Protocol,
  AwsLogDriver,
  Ec2Service,
  Ec2TaskDefinition,
} from "@aws-cdk/aws-ecs";
import {
  Vpc,
  InstanceType,
  InstanceClass,
  InstanceSize,
} from "@aws-cdk/aws-ec2";

interface EcsStackProps extends StackProps {
  readonly prefix: string;
  readonly stage: string;
  readonly vpc: Vpc;
}

class EcsStack extends Stack {
  public readonly ec2Service: Ec2Service;

  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    /**
     * Get var from props
     */
    const { prefix, stage, vpc } = props;

    /**
     * Create Cluster
     */
    const cluster = new Cluster(this, `${prefix}-${stage}-Cluster`, {
      clusterName: `${prefix}-${stage}-Cluster`,
      vpc,
      containerInsights: true,
    });

    /**
     * Ec2 capacity
     */
    cluster.addCapacity(`${prefix}-${stage}-DefaultAutoScalingGroup`, {
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
    });

    /**
     * create a task definition with CloudWatch Logs
     */
    const logging = new AwsLogDriver({ streamPrefix: "sample/app" });

    /**
     * Create Task Definition
     */
    const taskDefinition = new Ec2TaskDefinition(
      this,
      `${prefix}-${stage}-Task-Def`,
    );

    /**
     * Create Container
     */
    const container = taskDefinition.addContainer("web", {
      image: ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 128,
      logging,
    });

    /**
     * Container Port Mapping
     * 0:80 => mutiple task (desiredCount: number)
     */
    container.addPortMappings({
      hostPort: 0,
      containerPort: 80,
      protocol: Protocol.TCP,
    });

    /**
     * Create Service
     */
    const ec2Service = new Ec2Service(this, `${prefix}-${stage}-Service`, {
      serviceName: `${prefix}-${stage}-Service`,
      cluster,
      taskDefinition,
      desiredCount: 2,
    });

    this.ec2Service = ec2Service;
  }
}

export { EcsStack };
