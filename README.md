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
# Test strace with netcat
## In http-server-container 
```
sudo docker exec -it httpd /bin/bash
cd /home; ./ncLoop.sh
```
## In strace-container
```
strace -p <PID of NC> # PID of NC will be found in the previous command
```
## In host
```
nc -z -v 127.0.0.1 1234
```

# Test strace with httpd
## In strace-container
Here httpd generates child worker processes. The worker processes have user as "xfs". So, the corresponding trace commands would be as follows.
```
strace -e trace=network $(for pid in $(pgrep -u "xfs"); do echo -n " -fp $pid"; done) -fp 1
```
## In host
```
wget -O /dev/null http://127.0.0.1:8080
```
or
```
lynx http://localhost:8080
```
# Auxiliary Notes

```
strace -p 1 -e trace=bind,connect,accept,accept4,clone,close,creat,dup,dup2,dup3,execve,exit,exit_group,fork,open,openat,rename,renameat,unlink,unlinkat,vfork,read,write
```
strace -p 1 \
    -e trace=socket,connect,bind,listen,accept,accept4,send,sendto,sendmsg,recv,recvfrom,recvmsg,getsockopt,setsockopt


```
strace -p 1 \
    -e trace=bind,connect,accept,accept4,clone,close,creat,dup,dup2,dup3,execve,exit,exit_group,fork,open,openat,rename,renameat,unlink,unlinkat,vfork,read,write \
    -e success=successful \
    -e execve="/usr/local/apache2/bin/httpd"

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