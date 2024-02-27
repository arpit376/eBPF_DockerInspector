# Launch http-server-container
```
sudo sudo docker-compose -f docker-compose-httpd.yml up -d
```
# Launch strace-container
```
sudo docker-compose -f docker-compose-strace.yml up
```
or 
```
sudo docker run -it \
	--name strace \
	--pid=container:httpd \
	--net=container:httpd \
	--cap-add sys_admin \
	--cap-add sys_ptrace \
	strace /bin/sh
```

# Launch strace utility
```
strace -p 1 -e trace=bind,connect,accept,accept4,clone,close,creat,dup,dup2,dup3,execve,exit,exit_group,fork,open,openat,rename,renameat,unlink,unlinkat,vfork,read,write
```
Equivalent audit 

```
auditctl -a always,exit -F arch=b64 -S bind -S connect -S accept -S accept4 -S clone -S close -S creat -S dup -S dup2 -S dup3 -S execve -S exit -S exit_group -S fork -S open -S openat -S rename -S renameat -S unlink -S unlinkat -S vfork -S read -S write -F success=1 -F exe='/usr/local/apache2/bin/httpd'
```
# Cleanup
```
sudo docker-compose -f docker-compose-strace.yml down
sudo docker-compose -f docker-compose-httpd.yml down
```
or Cleanup everything
```
sudo docker kill $(sudo docker ps -q); sudo docker rm $(sudo docker ps -a -q)
```