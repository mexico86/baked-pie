#!/bin/sh

# EC2 user home directory
USER=ec2-user
DIR=/home/${USER}
cd $DIR;

# Install Git
yum update -y
yum install -y git

# Install NVM into root directory
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. /.nvm/nvm.sh

# Install Node.JS
nvm install node

# Clone the example application
git clone https://github.com/mexico86/prebaked-pie.git

# Install the example application
pushd prebaked-pie;
npm install;
popd

# Change ownership
chown -R ${USER}:${USER} prebaked-pie/

# Add the example application to the reboot crontab
echo "@reboot ec2-user ${NVM_BIN}/node /home/ec2-user/prebaked-pie/src/index.js &" > /etc/cron.d/prebaked-pie

# Start the example application
sudo -u ec2-user ${NVM_BIN}/node prebaked-pie/src/index.js &
