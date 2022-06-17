#!/bin/bash

echo Enter version \#?
read VERSION

docker build -t gattlinwalker/lireddit:$VERSION .
docker push gattlinwalker/lireddit:$VERSION
ssh root@64.227.13.208 "docker pull gattlinwalker/lireddit:$VERSION && docker tag gattlinwalker/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"