# Launch http-server
```
sudo sudo docker-compose -f docker-compose-httpd.yml up -d
```
# Launch strace
```
sudo docker-compose -f docker-compose-strace.yml up
```
or 
```
sudo docker run -it \
	--name strace \
	--pid=container:my-apache-app \
	--net=container:my-apache-app \
	--cap-add sys_admin \
	--cap-add sys_ptrace \
	strace /bin/sh
```


# Cleanup
```
sudo docker-compose -f docker-compose-strace.yml down
sudo docker-compose -f docker-compose-httpd.yml down
```