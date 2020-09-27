#!/usr/bin/env node
require("dotenv").config();

import "source-map-support/register";

import { App } from "@aws-cdk/core";

import { EcsStack, ElbStack, VpcEc2NatStack } from "./../lib";

/**
 * AWS Account / Region Definition
 */
const {
  PREFIX: prefix = "[STACK PREFIX NAME]",
  STAGE: stage = "[DEPLOYMENT STAGE]",
  CDK_ACCOUNT: accountId = "[AWS ACCOUNT ID]",
  CDK_REGION: region = "ap-southeast-1",
} = process.env;

/**
 * AWS defulat ENV config Definition
 */
const env = {
  account: accountId,
  region: region,
};

/**
 * Create Application
 */
const app = new App();

/**
 * Ec2 Nat Instance
 */
const vpcEv2Nat = new VpcEc2NatStack(app, `${prefix}-${stage}-Nat-Provider`, {
  env,
  prefix,
  stage,
});

/**
 * Create Ecs Stack
 */
const ecs = new EcsStack(app, `${prefix}-${stage}-EcsStack`, {
  env,
  prefix,
  stage,
  vpc: vpcEv2Nat.vpc,
});

/**
 * Create Elb Stack
 */
new ElbStack(app, `${prefix}-${stage}-ElbStack`, {
  env,
  prefix,
  stage,
  vpc: vpcEv2Nat.vpc,
  ec2Service: ecs.ec2Service,
});

/**
 * Output Synth
 */
app.synth();
