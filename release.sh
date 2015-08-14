#!/bin/sh
echo ""
echo "###########################################"
echo "  Releasing the API Manager bower component"
echo "###########################################"
echo ""


RELEASE_VERSION=$1
BOWER_VERSION=$2

if [ "x$RELEASE_VERSION" = "x" ]
then
  read -p "apiman Version: " RELEASE_VERSION
fi

if [ "x$BOWER_VERSION" = "x" ]
then
  read -p "Bower Component Version: " BOWER_VERSION
fi

echo "######################################"
echo "apiman Version: $RELEASE_VERSION"
echo "Bower Component Version: $BOWER_VERSION"
echo "######################################"
echo ""


rm -rf target
mkdir target

if [ -f ~/.m2/repository/io/apiman/apiman-manager-ui-hawtio/$RELEASE_VERSION/apiman-manager-ui-hawtio-$RELEASE_VERSION.war ]; then
    echo "Release discovered in the local .m2 directory...."
    cp ~/.m2/repository/io/apiman/apiman-manager-ui-hawtio/$RELEASE_VERSION/apiman-manager-ui-hawtio-$RELEASE_VERSION.war target/apiman-manager-ui-hawtio-$RELEASE_VERSION.war
fi

if [ ! -f ~/.m2/repository/io/apiman/apiman-manager-ui-hawtio/$RELEASE_VERSION/apiman-manager-ui-hawtio-$RELEASE_VERSION.war ]; then
    echo "Release not found locally, downloading from Nexus...."
    curl -L https://repository.jboss.org/nexus/content/groups/public/io/apiman/apiman-manager-ui-hawtio/$RELEASE_VERSION/apiman-manager-ui-hawtio-$RELEASE_VERSION.war -o target/apiman-manager-ui-hawtio-$RELEASE_VERSION.war
fi

unzip -q target/apiman-manager-ui-hawtio-$RELEASE_VERSION.war -d target

rm -rf dist img
mkdir dist

cp -rf target/dist/* dist/.
cp -rf target/plugins/api-manager/css/* dist/.
cp -rf target/plugins/api-manager/img img
sed "s/v1.0.0/$BOWER_VERSION/" < target/bower.json > bower.json

git add . --all
git status

read -p "Does everything look to be in order (if so I will commit and tag)? [y/n] " CONFIRM

if [ $CONFIRM == 'y' ]; then
    echo "Great, here we go..."
    git commit -m "Performing release of apiman-manager bower component version $RELEASE_VERSION"
    git push origin master
    
    git tag -a -m "Tagging release $BOWER_VERSION" $BOWER_VERSION
    git push origin $BOWER_VERSION
    
    echo "All done!"
fi
if [ $CONFIRM == 'n' ]; then
    echo "OK fine.  Be that way!"
    exit 1
fi

