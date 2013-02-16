Vagrant::Config.run do |config|
  config.vm.define :deployasaurus do |deployasaurus|
    deployasaurus.vm.box = "precise32"
    deployasaurus.vm.box_url = "http://files.vagrantup.com/precise32.box"
    deployasaurus.vm.forward_port 3000, 3000
    deployasaurus.vm.provision :shell, :inline => <<-END.gsub(/^ {6}/, '')
      mkdir bin

      echo "Installing node.js v0.8.19 (4.5 MB)..."
      wget -nv http://nodejs.org/dist/v0.8.19/node-v0.8.19-linux-x86.tar.gz
      tar -zxf node-v0.8.19-linux-x86.tar.gz
      mv node-v0.8.19-linux-x86 nodejs
      ln -s /home/vagrant/nodejs/bin/* /home/vagrant/bin

      echo "Installing mongodb v2.2.2 (54.8 MB)..."
      wget -nv http://fastdl.mongodb.org/linux/mongodb-linux-i686-2.2.2.tgz
      tar -zxf mongodb-linux-i686-2.2.2.tgz
      mv mongodb-linux-i686-2.2.2 mongodb
      ln -s /home/vagrant/mongodb/bin/* /home/vagrant/bin
      sudo mkdir -p /data/db
      sudo chown vagrant:vagrant /data/db

      echo "Installing redis v2.6.10 (991 KB)..."
      sudo apt-get install make &> /dev/null
      wget -nv http://redis.googlecode.com/files/redis-2.6.10.tar.gz
      tar -zxf redis-2.6.10.tar.gz
      mv redis-2.6.10 redis
      cd redis
      make &> /dev/null
      cd
      ln -s /home/vagrant/redis/src/redis-server /home/vagrant/bin

      echo "Setting up environment..."
      echo "export NODE_ENV=\"production\"" >> .profile
      export NODE_ENV="production"
      echo "export MONGOHQ_URL=\"mongodb://localhost:27017/deployasaurus\"" >> .profile
      export MONGOHQ_URL="mongodb://localhost:27017/deployasaurus"
      echo "export REDISTOGO_URL=\"redis://localhost:6379/\"" >> .profile
      export REDISTOGO_URL="redis://localhost:6379/"

      echo "Starting mongod and redis-server..."
      nohup /home/vagrant/bin/mongod &> mongodb.log &
      nohup /home/vagrant/bin/redis-server &> redis.log &

      echo "Starting deployasaur.us..."
      cd /vagrant
      /home/vagrant/bin/npm install
      nohup /home/vagrant/bin/node index.js &> ~/deployasaur.us.log &
    END
  end
end