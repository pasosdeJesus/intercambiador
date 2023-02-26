#!/bin/sh
# Stops services

if (test -f ".env") then {
  . .env
} fi;
if (test "$RAILS_ENV" = "production") then {
  if (test ! -f /etc/rc.d/$RC) then {
    echo "Falta script /etc/rc.d/$RC"
    exit 1;
  } fi;

  doas rcctl -d stop $RC
} elif (test "$RAILS_ENV" = "development") then {
  if (test -f backend/tmp/pids/server.pid) then { 
    pp=`cat backend/tmp/pids/server.pid`
    ps -p $pp | grep "ruby: puma" > /dev/null
    if (test "$?" = "0") then {
      echo "Killing rails process $pp"
      kill -9 $pp
    } fi;
  } fi;
  # Stopping vite
  pn=`fstat | grep $PUERTORECVIVA | sed -e "s/^[^\s]* node *\([0-9][0-9]*\) .*/\1/g" | sort -u`
  if (test "$pn" != "") then {
    echo "Matando proceso con node $pn"
    kill -9 $pn
  } fi;
} fi;

if (test -f "bin/detiene-local") then {
  . bin/detiene-local;
} fi;
