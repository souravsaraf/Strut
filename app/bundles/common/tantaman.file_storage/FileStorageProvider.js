define(function()
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
	
	function recursiveRegexSearch(path , regex , cb , results)
	{
		var files=FileStorageProvider.impl.readdirSync(path);
		for(var i=0;i<files.length;i++)
		{
			if(/^\..*/.test(files[i])) // tests if file or dir begins with a . (dot) , This means a hidden file/directory. Skip if found.
			{
				continue;
			}
			var filename=require('path').join(path,files[i]);
			try
			{
				var stat = FileStorageProvider.impl.lstatSync(filename);
			}
			catch(e)
			{
				console.log("Some Problem while reading '%s'. Error : %s" , filename , e.message);
				continue;
			}
			if (stat.isDirectory())
			{
				recursiveRegexSearch(filename,regex,cb,results); //recurse if a directory
			}
			else
			{
				if (regex.test(filename))
				{	
					results.push(filename);
					// if(cb)
					// {
					// 	cb(filename); 
					// } 
				}
			}
		}
		return results;
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
	
	FileStorageProvider.prototype = 
	{
		ready: function()
		{
			return true;
		},

		bg: function()
		{
		},

		ls: function(path, regex, cb)
		{
			let results = [];
			if (!FileStorageProvider.impl.existsSync(path))
			{
				console.log("Directory or filename does not exist" , path);
				if(cb) cb(null);
			}
			else
			{
				// the given 'path' exists
				if(FileStorageProvider.impl.lstatSync(path).isDirectory())
				{
					// if the given 'path' is a directory , then do the recursive regex search for files.
					results = recursiveRegexSearch(path , regex , cb , results);
					if((Array.isArray(results)) && (results.length > 0) && (cb) )
					{
						cb(results); 
					}
				}
				else
				{
					// if the given 'path' is a file , then just call the callback function cb on that file.
					if(cb) cb(path);
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
				if(cb) cb(true);
				return FileStorageProvider;
			}
			catch (e)
			{
				console.log("Cannot delete file ", e);
				if(cb) cb(false);
				return FileStorageProvider;
			}
		},

		getContents: function(path, cb)
		{
			// The objective here is to read a file if text , read the string , validate if json , return json object to the callback function
			// Check if path is a text file before reading
			var isAFile = FileStorageProvider.impl.lstatSync(path).isFile();
			var isText = !isABinaryFile(path);
			if( isAFile && isText )
			{
				// Reads file synchronously in the default encoding ie, utf8.
				try
				{
					let data = FileStorageProvider.impl.readFileSync(path , DEFAULT_ENCODING);
					console.dir(data);
					if(IsJsonStringOrJsonObject(data))
					{
						data = JSON.parse(data);
						if(cb) { cb(data); }
						return FileStorageProvider;
					}
					else 
					{
						console.log("Could not read non-json data from the file at %s" , path);
						if(cb) { cb(null); }
						return FileStorageProvider;
					}
				}
				catch(e)
				{
					console.log("Error in reading file %s , %s" , path , e.msg);
					if(cb) { cb(null); }
					return FileStorageProvider;
				}
			}
			else
			{
				console.log("Cannot read : %s" , path);
				if(cb) { cb(null); }
				return FileStorageProvider;
			}
		},

		setContents: function(path, data, cb)
		{
			// Writes file (overwrite or create) synchronously in the default encoding ie, utf8.
			if(IsJsonStringOrJsonObject(data))
			{
				try
				{
					data = JSON.stringify(data);
					FileStorageProvider.impl.writeFileSync(path, data, DEFAULT_ENCODING);
					if(cb) { cb(true); }
					return FileStorageProvider;
				}
				catch (e)
				{
					console.log("Cannot write file : %s " , e.msg);
					if(cb) { cb(false); }
					return FileStorageProvider;
				}
			}
			else
			{	
				console.log("Cannot write non-Json data to file. Write failed to %s" , path);
				if(cb) { cb(false); }
				return FileStorageProvider;
			}
		}
	};
	return FileStorageProvider;
});