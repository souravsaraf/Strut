define(['../util', './common', './syncTransaction', 'fs'], function(util, common, syncTransactionAdapter, fs) {

	// Namespace: store.fileSystemStorage
	// <StorageAdapter> implementation that keeps data in the operating system's file system.
	
	logger.info("Inside fileSystemStorage");
	
	var fileSystemStorage;
	var nodes = {};
	var logger = util.getLogger('store::fileSystemStorage');
	var events = util.getEventEmitter('change');
	
	const DEFAULT_ENCODING = "utf8";
	const ALLOWED_MIME_TYPE = "application/json";
	
	function isFileMimeTypeOK(path)
	{
		var mmm = require('mmmagic');
		Magic = mmm.Magic;
		var magic = new Magic(mmm.MAGIC_MIME_TYPE);
		magic.detectFile(path, function(err, result) {
			if (err) throw err;
			logger.info("The MIME type of the file : " + path + "is : " + result);
			if(result == ALLOWED_MIME_TYPE) {return true;}
		});
		return false;
	}
	
	function IsJsonString(str) 
	{
		try 
		{
			let o = JSON.parse(str);
			if (o && typeof o === "object") { return true; }
		}
		catch (e) 
		{
			return false;
		}
	}
	
	function readFileAsJsonText(path)
	{
		// Reads file synchronously in the default encoding ie, utf8.
		try
		{
			let data = fs.readFileSync(path , DEFAULT_ENCODING);
			logger.info("The contents of the file : " + path + " are : \n" + data);
			if(!IsJsonString(data)) { return null; }
			else { return data; }
		}
		catch(e)
		{
			logger.error("Cannot read file ", e);
		}
		return null;
	}
	
	function writeFile(path , data)
	{
		// Writes file synchronously in the default encoding ie, utf8.
		try
		{
			fs.writeFileSync(path, data, DEFAULT_ENCODING);
			logger.info("The file was succesfully saved at : " + path);
			return true;
		}
		catch (e)
		{
			logger.error("Cannot write file ", e);
		}
		return false;
	}
	function deleteFile(path)
	{
		// Deletes file synchronously.
		try
		{
			fs.unlinkSync(path);
			logger.info("The file " + path + "was succesfully deleted");
			return true;
		}
		catch (e)
		{
			logger.error("Cannot delete file ", e);
		}
		return false;
	}
	
	return function(_fileSystemStorage)
	{
		fileSystemStorage = _fileSystemStorage || (typeof(window) !== 'undefined' && fs);
		if(!fileSystemStorage)
		{
			throw new Error("Not supported: fileSystemStorage not found.");
		}
	
		var store = 
		{
			get: function(path)
			{
				logger.info('get', path);
				if(isFileMimeTypeOK(path))
				{
					let jsonTextFromFile = readFileAsJsonText(path);
					if(!jsonTextFromFile)
					{
						var node = new Object();
						node.startAccess = null,
						node.startForce = null,
						node.startForceTree = null,
						node.timestamp = 0,
						node.lastUpdatedAt = 0,
						node.path = path;
						node.data = jsonTextFromFile;
						node.mimeType = ALLOWED_MIME_TYPE;
						node.encoding = DEFAULT_ENCODING;
						nodes[path] = node;
						return util.getPromise().fulfill(nodes[path]);
					}
				}
				else
				{
					return util.getPromise().reject;
				}
			},
	
			set: function(path, node)
			{
				logger.info('set', path, node.data);
				nodes[path] = node;
				if(writeFile(path , node.data))
				{
					return util.getPromise().fulfill();
				}
				return util.getPromise().reject;
			},
	
			remove: function(path)
			{
				logger.info('remove', path);
				delete nodes[path];
				if(deleteFile(path))
				{
					return util.getPromise().fulfill();
				}
				return util.getPromise().reject;
			}
		};
	
		return util.extend({
	
		on: events.on,
	
		forgetAll: function()
		{
			logger.info('forgetAll');
			nodes = {};
			return util.getPromise().fulfill();
		}
		}, syncTransactionAdapter(store, logger));
	};
});

