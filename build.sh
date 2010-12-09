#
#	Tt copies the files needed for making the
#	W3C widget build in the right location.
#

rm -Rf tmp

# Create the directory structure we will need within the wgt file.
mkdir -p tmp/src/js
mkdir -p tmp/src/audio
mkdir -p tmp/src/img

cd tmp/src

# All JavaScript files, that need to be included in the widget.
cp ../../src/js/* ./js
cp ../../src/audio/* ./audio
cp ../../src/img/* ./img

# All other files.
cp ../../src/index.html .
cp ../../src/config.xml .




# Create the wgt file, which is the final opera widget!
rm ../../dist/touchaudio.wgt
zip -r ../../dist/touchaudio.wgt config.xml index.html js/ audio/ img/


##
## Create the Nokia WRT widget.
##
#rm config.xml
#cp ../../src/Info.plist .
#cd .. # Move to /tmp/ so we have a "src" directory which we can zip then
## A nokia WRT widget has to be in the directory "src" for packaging it ... for whatever reason, but it wont install otherwise ... grrrr
#zip -r ../dist/touchaudio.wgz src/*


# Clean up.
cd ..
rm -Rf tmp

