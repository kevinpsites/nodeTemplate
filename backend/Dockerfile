# FROM public.ecr.aws/docker/library/node:18 as builder

# RUN mkdir /build
# WORKDIR /build
# COPY terraform/dist/account-service--1.zip /build/dist/account-service.zip
# RUN unzip /build/dist/account-service.zip

FROM public.ecr.aws/lambda/nodejs:18

# Copy function code
COPY /lambdaFunction ${LAMBDA_TASK_ROOT}/
COPY node_modules/ ${LAMBDA_TASK_ROOT}/node_modules
# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "index.handler" ]
