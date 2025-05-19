read -p "project name: " project
read -p "port: " port
git checkout .
git pull
sudo docker build -t $project-server .
docker stop $project-server-ctn
docker rm $project-server-ctn
docker run -d --name $project-server-ctn --restart=always -p $port:8000 $project-server
