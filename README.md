# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

# How to Deploy

1. Install npm package

   ```sh
   $ npm i
   ```

2. Synth the .yaml template

   ```sh
   $ cdk cdk synth
   ```

3. List the Stacks

   ```sh
   $ cdk list
   ```

   output:

   ```
   Ecs-EC2-ALB-Dev-Nat-Provider
   Ecs-EC2-ALB-Dev-ElbStack
   Ecs-EC2-ALB-Dev-EcsStack
   ```

4. Deploy to AWS

   ```sh
   $ cdk deploy Ecs-EC2-ALB-Dev-EcsStack
   ```

# Test

find out the alb endpoit in the previous steps, the output will be as below foramt:

    Outputs:
    Ecs-EC2-ALB-Dev-ElbStack.EcsEC2ALBDevLoadBalancerDNSName = Ecs-EC2-ALB-Dev-ALB-${id}.us-east-1.elb.amazonaws.com

browse the link: Ecs-EC2-ALB-Dev-ALB-\${id}.us-east-1.elb.amazonaws.com
