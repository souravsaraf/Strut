define(['strut/electron_config/model/ElectronConfigInterface', 'lodash'], function(ElectronConfigInterface, _)
{
	var FileStorageProvider;

	function FileStorageProvider()
	{
		var fs = require('fs');
		this.impl = fs;
		this.name = "File Storage";
		this.id = "filestorage";
		FileStorageProvider = this;
	}

	const DEFAULT_ENCODING = "utf8";
	// const ALLOWED_MIME_TYPE = "text/plain"; // we cannot construct or save files with "application/json" mime type. A json file is also a "text/plain" file.

	let electronConfigInterface = new ElectronConfigInterface();

	function recursiveRegexSearch(path, regex, cb, results)
	{
		var files = FileStorageProvider.impl.readdirSync(path);
		for (var i = 0; i < files.length; i++)
		{
			if (/^\..*/.test(files[i])) // tests if file or dir begins with a . (dot) , This means a hidden file/directory. Skip if found.
			{
				continue;
			}
			var filename = require('path').join(path, files[i]);
			try
			{
				var stat = FileStorageProvider.impl.lstatSync(filename);
			}
			catch (e)
			{
				console.log("Some Problem occured while reading '%s'. Error : %s", filename, e.message);
				continue;
			}
			if (stat.isDirectory())
			{
				recursiveRegexSearch(filename, regex, cb, results); //recurse if a directory
			}
			else
			{
				if (regex.test(filename))
				{
					results.push(filename);
				}
			}
		}
		return results;
	}

	function nonRecursiveRegexSearch(path, regex)
	{
		console.log("Search Path is : " + path);
		let results = [];
		var files = FileStorageProvider.impl.readdirSync(path);
		for (var i = 0; i < files.length; i++)
		{
			if (/^\..*/.test(files[i])) // tests if file or dir begins with a . (dot) , This means a hidden file/directory. Skip if found.
			{
				continue;
			}
			var filename = require('path').join(path, files[i]);
			try
			{
				var stat = FileStorageProvider.impl.lstatSync(filename);
			}
			catch (e)
			{
				console.log("Some Problem occured while reading '%s'. Error : %s", filename, e.message);
				continue;
			}
			if (stat.isDirectory())
			{
				continue;
			}
			else
			{
				if (regex.test(filename))
				{
					results.push(filename);
				}
			}
		}
		return results;
	}

	function combineRecentWithSearch(path, regex)
	{
		let electronConfigObject = electronConfigInterface.getConfig();
		let oldRecentFilesArray = electronConfigObject.storage.recentFilesList;
		let oldRecentFilesCount = oldRecentFilesArray.length;
		let recentFilesCountToShow = electronConfigObject.storage.recentFilesCount;
		let searchResult = nonRecursiveRegexSearch(path, regex);
		let common = _.intersection(searchResult, oldRecentFilesArray);
		let difference = _.difference(searchResult, common);
		let newerFilesArray = difference.slice(0, recentFilesCountToShow);
		let newerFilesCount = newerFilesArray.length;
		if (oldRecentFilesCount + newerFilesCount > recentFilesCountToShow)
		{
			trimCount = recentFilesCountToShow - (oldRecentFilesCount + newerFilesCount);
			trimmedNewerFilesArray = newerFilesArray.slice(0, (newerFilesCount - trimCount));
			let mergedArray = oldRecentFilesArray.concat(trimmedNewerFilesArray); // equivalent to push
			electronConfigObject.storage.recentFilesList = mergedArray;
			electronConfigInterface.setConfig(electronConfigObject);
			return mergedArray;
		}
		else
		{
			let mergedArray = oldRecentFilesArray.concat(newerFilesArray); // equivalent to push
			electronConfigObject.storage.recentFilesList = mergedArray;
			electronConfigInterface.setConfig(electronConfigObject);
			return mergedArray;
		}
	}

	function addFileToRecentList(path)
	{
		let electronConfigObject = electronConfigInterface.getConfig();
		let recentFilesArray = electronConfigObject.storage.recentFilesList;
		let recentFilesCountToShow = electronConfigObject.storage.recentFilesCount;
		recentFilesArray.unshift(path);
		recentFilesArray = _.uniq(recentFilesArray);
		let recentFilesCount = recentFilesArray.length;
		if (recentFilesCount > recentFilesCountToShow)
		{
			recentFilesArray.pop();
		}
		electronConfigObject.storage.recentFilesList = recentFilesArray;
		electronConfigInterface.setConfig(electronConfigObject);
	}

	function isABinaryFile(path)
	{
		var isBinaryFile = require('isbinaryfile');
		var result = isBinaryFile.sync(path);
		return result;
	}

	function IsJsonStringOrJsonObject(x)
	{
		var str = JSON.stringify(x);
		try
		{
			let obj = JSON.parse(str);
			let isEmpty = (Object.keys(obj).length) === 0;
			return !isEmpty;
		}
		catch (e)
		{
			return false;
		}
		return false;
	}

	FileStorageProvider.prototype = {
		ready: function()
		{
			return true;
		},

		bg: function() {},

		ls: function(path, regex, cb)
		{
			let results = [];
			if (!FileStorageProvider.impl.existsSync(path))
			{
				console.log("Directory or filename does not exist", path);
				if (cb) cb(null);
			}
			else
			{
				// the given 'path' exists
				if (FileStorageProvider.impl.lstatSync(path).isDirectory())
				{
					// if the given 'path' is a directory , then do the recursive regex search for files.
					results = combineRecentWithSearch(path, regex);
					if ((Array.isArray(results)) && (cb))
					{
						cb(results);
					}
				}
				else
				{
					// if the given 'path' is a file , then just call the callback function cb on that file.
					if (cb) cb(path);
				}
			}
			return FileStorageProvider;
		},

		rm: function(path, cb)
		{
			// Deletes file synchronously.
			try
			{
				FileStorageProvider.impl.unlinkSync(path);
				let electronConfigObject = electronConfigInterface.getConfig();
				let recentFilesArray = electronConfigObject.storage.recentFilesList;
				let index = recentFilesArray.indexOf(path);
				if (index !== -1)
				{
					recentFilesArray.splice(index, 1);
				}
				electronConfigObject.storage.recentFilesList = recentFilesArray;
				electronConfigInterface.setConfig(electronConfigObject);
				if (cb) cb(true);
				return FileStorageProvider;
			}
			catch (e)
			{
				console.log("Cannot delete file ", e);
				if (cb) cb(false);
				return FileStorageProvider;
			}
		},

		getContents: function(path, cb)
		{
			// The objective here is to read a file if text , read the string , validate if json , return json object to the callback function
			// Check if path is a text file before reading
			var isAFile = FileStorageProvider.impl.lstatSync(path).isFile();
			var isText = !isABinaryFile(path);
			if (isAFile && isText)
			{
				// Reads file synchronously in the default encoding ie, utf8.
				try
				{
					let data = FileStorageProvider.impl.readFileSync(path, DEFAULT_ENCODING);
					console.dir(data);
					if (IsJsonStringOrJsonObject(data))
					{
						data = JSON.parse(data);
						addFileToRecentList(path);
						if (cb)
						{
							cb(data);
						}
						return FileStorageProvider;
					}
					else
					{
						console.log("Could not read non-json data from the file at %s", path);
						if (cb)
						{
							cb(null);
						}
						return FileStorageProvider;
					}
				}
				catch (e)
				{
					console.log("Error in reading file %s , %s", path, e.msg);
					if (cb)
					{
						cb(null);
					}
					return FileStorageProvider;
				}
			}
			else
			{
				console.log("Cannot read : %s", path);
				if (cb)
				{
					cb(null);
				}
				return FileStorageProvider;
			}
		},

		setContents: function(path, data, cb)
		{
			// Writes file (overwrite or create) synchronously in the default encoding ie, utf8.
			if (IsJsonStringOrJsonObject(data))
			{
				try
				{
					data = JSON.stringify(data);
					FileStorageProvider.impl.writeFileSync(path, data, DEFAULT_ENCODING);
					addFileToRecentList(path);
					if (cb)
					{
						cb(true);
					}
					return FileStorageProvider;
				}
				catch (e)
				{
					console.log("Cannot write file : %s ", e.msg);
					if (cb)
					{
						cb(false);
					}
					return FileStorageProvider;
				}
			}
			else
			{
				console.log("Cannot write non-Json data to file. Write failed to %s", path);
				if (cb)
				{
					cb(false);
				}
				return FileStorageProvider;
			}
		}
	};
	return FileStorageProvider;
});