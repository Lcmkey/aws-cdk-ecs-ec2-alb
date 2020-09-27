import {
  Construct,
  Stack,
  StackProps,
  CfnOutput,
  Duration,
} from "@aws-cdk/core";
import { Cluster, FargateService } from "@aws-cdk/aws-ecs";
import {
  ApplicationLoadBalancer,
  ApplicationProtocol,
  NetworkLoadBalancer,
} from "@aws-cdk/aws-elasticloadbalancingv2";
import { Vpc } from "@aws-cdk/aws-ec2";

interface ElbStackProps extends StackProps {
  readonly prefix: string;
  readonly stage: string;
  // readonly cluster: Cluster;
  readonly ec2Service: FargateService;
  readonly vpc: Vpc;
  // readonly clusterArn: string;
  // readonly clusterName: string;
}

class ElbStack extends Stack {
  constructor(scope: Construct, id: string, props: ElbStackProps) {
    super(scope, id, props);

    /**
     * Get var from props
     */
    const { prefix, stage, vpc, ec2Service } = props;

    /**
     * Create Application Load Balancer
     */
    const lb = new ApplicationLoadBalancer(this, `${prefix}-${stage}-ALB`, {
      loadBalancerName: `${prefix}-${stage}-ALB`,
      vpc,
      internetFacing: true,
    });

    const listener = lb.addListener(`${prefix}-${stage}-PublicListener`, {
      port: 80,
      open: true,
    });

    /**
     * Attach ALB to ECS Service
     */
    listener.addTargets("ECS", {
      targetGroupName: `${prefix}-${stage}-ECS-TG`,
      port: 80,
      targets: [
        ec2Service.loadBalancerTarget({
          containerName: "web",
          containerPort: 80,
        }),
      ],
      // include health check (default is none)
      healthCheck: {
        interval: Duration.seconds(60),
        path: "/",
        timeout: Duration.seconds(5),
      },
    });

    /**
     * Cfn Ouput
     */
    this.createCfnOutput({
      id: `${prefix}-${stage}-LoadBalancer-DNS-Name`,
      value: lb.loadBalancerDnsName,
    });
    this.createCfnOutput({
      id: `${prefix}-${stage}-LoadBalancer-Arn`,
      value: lb.loadBalancerArn,
    });
  }

  /**
   * Create Cloudformation Output
   * @param param0
   */
  private createCfnOutput({ id, value }: { id: string; value: string }) {
    new CfnOutput(this, id, { value });
  }
}

export { ElbStack };
