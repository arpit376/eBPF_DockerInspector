# Launch http-server
```
sudo docker-compose -f docker-compose-httpd.yml up -d my-apache-app
```
# Launch strace
```
sudo docker run -t \
	--pid=container:my-apache-app \
	--net=container:my-apache-app \
	--cap-add sys_admin \
	--cap-add sys_ptrace \
	strace
```