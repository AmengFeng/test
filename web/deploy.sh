read -p "project name: " project
read -p "port: " port
git checkout .
git pull
sudo docker build -t $project-web .
docker stop $project-web-ctn
docker rm $project-web-ctn
docker run -d --name $project-web-ctn --restart=always -p $port:80 $project-web