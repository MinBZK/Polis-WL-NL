
# Developer setup for Ubuntu 20.04.5 LTS Virtual Machine

This is a guide on how to setup a running Pol.is instance. This is meant primarily for easy development but could be adapted for production use by adding a suitable reverse-proxy and some further hardening such as running services as a user with limited privileges.

## Setup

You can use [Ubuntu Multipass](https://multipass.run/) to easily setup a virtual machine on your local laptop. You will need at least 8GB RAM and 16GB of disk

For MacOS

```
brew install --cask multipass
multipass launch -c 2 -m 8G -d 16G -n polis-dev focal
multipass shell polis-dev
```

Once in the multipass shell, add your public SSH key to `.ssh/authorized_users` to enables easy shell access from your laptop. To find out the IP for SSH access run

```
multipass info polis-dev
```

You can then shell in using `ssh ubuntu@<MACHINE_IP_ADDRESS>` and use remote development in VSCode for example.

## Configuring the Virtual Machine

For a production setup you will want to setup a limited privilege `polis` user, for development you may want to simplify things by running everything as the `ubuntu` user. Note that you will need to change the `.envrc` database connection strings to reflect this

## General server

```sh
# user:root
apt update

# production only
useradd -m -s /bin/bash polis
passwd polis

apt install -y postgresql g++ git make python python-dev libpq-dev direnv nginx

# configure direnv
echo "eval \"\$(direnv hook bash)\"" >> ~/.bashrc
source ~/.bashrc

# node.js
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n lts
npm install -g n
n 18.12.1
n 16.19.0 # For server on Ubuntu
npm install -g npm@7.0
```

```
# user:ubuntu
git clone https://github.com/DFE-Digital/polis-whitelabel.git
```

## polis/database

```sh
# user:root
sudo -i -u postgres

# user:postgres
# for production, use 'polis' for development use 'ubuntu'
createuser polis
psql
```

```sql
postgres=# ALTER USER polis CREATEDB;
ALTER USER polis PASSWORD '<some-password>';
\q
```

where `<some-password>` is your user's database password.

Now follow the instructions in the [database README](database/README.md) switching out polis for ubuntu if on the development system.

## polis/server

```sh
# user:root (production only)
n 16.19.0
su - polis

cd polis/server/

cp .envrc.example .envrc  # Be sure to update DATABASE_URL accordingly
direnv allow .
npm install
npm run build
npm start
```

## polis/client-admin

```sh
# user:root (production only)
n use 18.12.1
su - polis

cd polis/client-admin
npm install

cp polis.config.template.js polis.config.js
npm run build:prod
```

## polis/client-participation

```sh
# user:root (production only)
n use 18.12.1
su - polis

cd polis/client-admin
npm install

cp polis.config.template.js polis.config.js
npm run build:prod
```

## polis/client-report

```sh
# user:root (production only)
n use 18.12.1
su - polis

# user:polis
cd polis/client-report
npm install

npm run build:prod
```

## polis/file-server

```sh
# user:root
n use 18.12.1
su - polis

# user:polis
cd polis/file-server
cp fs_config.template.json fs_config.json
npm install

# bring all js bundles here
mkdir build
make

npm run start
```

## polis/math

```sh
# user:root
cp .envrc.example .envrc # Be sure to update DATABASE_URL accordingly
apt install -y openjdk-17-jre rlwrap
curl -O https://download.clojure.org/install/linux-install-1.11.1.1155.sh
chmod +x linux-install-1.11.1.1155.sh
./linux-install-1.11.1.1155.sh
rm linux-install-1.11.1.1155.sh

# user:polis
clojure -A:dev -P
clojure -M:run full
```

## polis/reverse-proxy

```sh
cp .devcontainer/nginx.conf /etc/nginx/conf.d/default.conf

# user:root
nginx -t # Check the config
systemctl restart nginx # restart the server

# To empty the Nginx cache
systemctl stop nginx
rm -rf /var/cache/nginx
systemctl start nginx
```

## After reboot

```sh
cd polis/

cd file-server/
npm start

cd ../math/
clojure -M:run full

cd ../server/
npm start
```

## Development

```sh
cd polis/

cd file-server/
npm start

cd ../math/
clojure -X:dev-poller

cd ../server/
npm run dev
```
