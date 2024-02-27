#!/bin/bash

while :
do
    echo "Sending 'OK' to port 1234"
    echo "OK" | nc -lkp 1234 &
    echo "PID of nc process: $!"
    echo "Run \$ strace -p $!"
    wait $!
    echo "nc process terminated."
done
