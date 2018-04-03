First Steps : 

1. Figuring out what are the requirements.

Some research was done on the internet like how to organize/classify/group data. 
Refer to file "Research Notes.txt"

2. Figure out what software we will be extending.
Refer to file "Research Notes.txt" , and we find out that we will be extending the Struts GUI editor for impress.js.

3. Download and install required Tools for Setting up the environment for development.
3.0 Download and install Git https://git-scm.com/downloads
3.1 Steps For Setting up Struts : 
1. Download and Install "GitHub Desktop" https://desktop.github.com/
2. Register or sign in with your account
3. Open Git shell from the menu
4. To build your own version of Strut you'll need Node.js(any stable version) and Grunt(v0.4.0 or later).
	4.0. Install Node.js (if needed follow the instructions given here : http://blog.teamtreehouse.com/install-node-js-npm-windows)
	4.1. Install the latest Grunt: npm install -g grunt-cli
	4.2. Clone Strut: git clone git://github.com/tantaman/Strut.git
	4.3. cd Strut
	4.4. Install Strut's development dependencies: npm install
	4.5. If you find any dependencies not fulfilled or run into any issues here, I would suggest install npm-check https://github.com/dylang/npm-check
	     And, run the npm-check -u command which updates the dependencies and the package.json.
	4.5. Run Strut: grunt server (the server runs at localhost:9000)
	To make a production build of Strut run grunt build. The resulting build will be located in Strut/dist
	
5. To make a desktop app out of this website, install electron packager (npm install electron-packager -g) , run electron packager from the directory where package.json is located. 
electron-packager . --overwrite --out="electron_packager_output_directory" --icon="app/img/strut_icon_96.ico" --name="Strut" --igonre='.git'

echo.|time & rm -rf electron_packager_output_directory/* & electron-packager . --overwrite --out="electron_packager_output_directory" --icon="app/img/strut_icon_96.ico" --name="Strut" --igonre='.git' & echo.|time

echo.|time & rm -rf electron_packager_output_directory/* & node ./node_modules/electron-packager/cli.js . --overwrite --out="electron_packager_output_directory" --icon="app/img/strut_icon_96.ico" --name="Strut" --igonre='.git' & echo.|time

.\node_modules\.bin\electron-rebuild.cmd
