/*
This module's name is "FileStorageProvider". It requires 3 dependencies (all of them are node js modules) : 'fs' , 'path' , 'mmmagic'.
This module is written to support "AMD" , "CommonJS" and probably "UMD".

This module will export the class "FileStorageProvider" with some public functions and public variables which can be used later on by others. : 
{
	'use strict';
	
	FileStorageProvider = {}; // initially an empty object, we assign to it later.
	
	// As soon as we write "FileStorageProvider.something" , then we can say something becomes public as we are exporting the whole class FileStorageProvider.
	
	// Public functions will be exported this way. 
	
	FileStorageProvider.FileStorageProvider = function(){ ... } // constructor
	FileStorageProvider.ready = function() { ... }
	FileStorageProvider.bg = function() { ... }
	FileStorageProvider.ls = function(path, regex, cb) { ... }
	FileStorageProvider.rm = function(path, cb) { ... }
	FileStorageProvider.getContents = function(path, cb) { ... } 
	// we can use private functions pv1() , pv2() , pv3() and private variables 'x' , 'y' , 'pvs' here in these public functions.
	FileStorageProvider.setContents = function(path, data, cb) { ... }
	
	// Public variables will be exported this way. 
	
	FileStorageProvider.id = 'FSP';
	FileStorageProvider.a = 1;
	FileStorageProvider.b = 2;
	
	
	// Private functions which will not be exported.
	
	pv1() { ... }
	pv2() { ... }
	pv3() { ... }
	
	// Private variables which will not be exported.
	
	var x = 99;
	var y = 98;
	var pvs = "Sshhhhhh";
	
	return FileStorageProvider;
};


Reference links : 
http://ifandelse.com/its-not-hard-making-your-library-support-amd-and-commonjs/
https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/

*/

// UNCOMMENT THE MULTILINE COMMENT BELOW TO START WRITING THE UMD MODULE

/*

(function (root, callback) {
	if(typeof define === "function" && define.amd) {
		// Now we're wrapping the callback and assigning the return
		// value to the root (window) and returning it as well to
		// the AMD loader.
		define(['fs' , 'path' , 'mmagic'], function(fs , path , mmagic){
		return (root.FileStorageProvider = callback(fs , path , mmagic));
		});
	} else if(typeof module === "object" && module.exports) {
		// I've not encountered a need for this yet, since I haven't
		// run into a scenario where plain modules depend on CommonJS
		// *and* I happen to be loading in a CJS browser environment
		// but I'm including it for the sake of being thorough
		module.exports = (root.FileStorageProvider = callback(require('fs') , require('path') , require('mmagic')));
	} else {
		root.FileStorageProvider = callback(root.fs , root.path , root.mmagic);
	}
}(this, function(fs , path , mmagic) {
	
	// module code here....
	var FileStorageProvider = {};
	var x = 99; // private variable
	var y = 98; // private variable
	var pv1 = function () {} // private function
	FileStorageProvider.id = 'FSP'; // public variable
	FileStorageProvider.name = 'File Storage Provider'; // public variable
	FileStorageProvider.ready = function() {return true;} // public function
	return FileStorageProvider;
	
}));


*/