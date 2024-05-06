# Initialize
```
sudo docker-compose -f docker-compose-httpd.yml build
sudo docker-compose -f docker-compose-strace.yml build
```
or
```
sudo docker compose -f docker-compose-httpd.yml build
sudo docker compose -f docker-compose-strace.yml build
```
# Launch http-server-container
```
sudo docker-compose -f docker-compose-httpd.yml up -d
```
or
```
sudo docker compose -f docker-compose-httpd.yml up -d
```
# Launch strace-container
```
sudo docker-compose -f docker-compose-strace.yml up -d
```
or 
```
sudo docker compose -f docker-compose-strace.yml up -d
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
strace -t -e trace=network $(for pid in $(pgrep -u "xfs"); do echo -n " -fp $pid"; done) -fp 1
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
strace -e trace=bind,connect,accept,accept4,clone,close,creat,dup,dup2,dup3,execve,exit,exit_group,fork,open,openat,rename,renameat,unlink,unlinkat,vfork,read,write $(for pid in $(pgrep -u "xfs"); do echo -n " -fp $pid"; done) -fp 1

strace -p 1 \
    -e trace=socket,connect,bind,listen,accept,accept4,send,sendto,sendmsg,recv,recvfrom,recvmsg,getsockopt,setsockopt


strace -p 1 \
    -e trace=bind,connect,accept,accept4,clone,close,creat,dup,dup2,dup3,execve,exit,exit_group,fork,open,openat,rename,renameat,unlink,unlinkat,vfork,read,write \
    -e success=successful \
    -e execve="/usr/local/apache2/bin/httpd"

```

Equivalent audit 

```
auditctl -a always,exit -F arch=b64 -S bind -S connect -S accept -S accept4 -S clone -S close -S creat -S dup -S dup2 -S dup3 -S execve -S exit -S exit_group -S fork -S open -S openat -S rename -S renameat -S unlink -S unlinkat -S vfork -S read -S write -F success=1 -F exe='/usr/local/apache2/bin/httpd'
```

# Capture Packets
## Find target interface
### Check the IP of the container
```
sudo docker inspect httpd -f "{{json .NetworkSettings.Networks }}"
```
OUTPUT: 
```
{
  "ebpf_dockerinspector_default": {
    "IPAMConfig": null,
    "Links": null,
    "Aliases": [
      "httpd",
      "httpd",
      "8e5bbcc39cf7"
    ],
    "NetworkID": "da9be232d51ee028f4e0173069f2aba6e2be34e1e89f07146da5430be6169ee2",
    "EndpointID": "310a6f4e13eda093a78b23db9283e6835f66376a159595effbbcae192d22447f",
    "Gateway": "172.18.0.1",
    "IPAddress": "172.18.0.2",
    "IPPrefixLen": 16,
    "IPv6Gateway": "",
    "GlobalIPv6Address": "",
    "GlobalIPv6PrefixLen": 0,
    "MacAddress": "02:42:ac:12:00:02",
    "DriverOpts": null
  }
}
```
### Find Gateway IP
Find **"Gateway": " < IP > "** (e.g. `"Gateway": "172.18.0.1"`)
### Find interface name
```
netstat -ie | grep -B1 "<IP>"
```
## Capture packets with `tcpdump`
```
sudo tcpdump -i br-da9be232d51e -w httpd_docker.pcap
```
Stop packet cpature with `[CTRL+c]`
## Check the capture files with `wireshark`

# Cleanup
```
sudo docker-compose -f docker-compose-strace.yml down
sudo docker-compose -f docker-compose-httpd.yml down
```
or Cleanup everything
```
sudo docker kill $(sudo docker ps -q); sudo docker rm $(sudo docker ps -a -q)
```
