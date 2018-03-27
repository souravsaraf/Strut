define(['lodash'],
	function(_)
	{
		'use strict';

		/* The job of this interface/class is as follows : 

				It creates a Database file, where our Database and its tables will be created.
				We will have 4 tables as follows : 
				1. Presentations (id , title);
				2. Tags(tag);
				3. Presentations_Tags (id , tag);
				4. Presentations_History (id , history);

				It also deals with functions which are used to auto generate tags for presentations.

				Then this interface provides methods to add/update/delete rows from these tables. 
				The returned values are Javascript type objects and can be used in javascript.

				The interface only exposes those functions which can be used by the UI later on. 
				It does not expose internal methods used to modify the database.
		
				*/

		function ElectronLibraryInterface()
		{
			if (!(this instanceof ElectronLibraryInterface))
			{
				throw new TypeError(`ElectronLibraryInterface constructor cannot be called as a regular function. 
				Use 'new ElectronLibraryInterface()' to create an object.`);
			}
			this.databaseFile = initializeDatabase();
			this.numTags = 10;
			this.numHistory = 5;
		}

		const
		{
			remote
		} = require('electron');
		const path = require('path');
		const fs = require('fs');
		const Database = require('better-sqlite3');

		// let extractedTags = [];
		// let tagExtractionDone = false;

		function initializeDatabase()
		{
			let appPath = remote.app.getPath('userData');
			let filename = "strutTagLibrary.db";
			let databaseFile = path.join(appPath, filename);
			try
			{
				let db = new Database(databaseFile);
				db.pragma('foreign_keys = ON');
				let sqlFile = path.join(require.toUrl(''), requirejs.s.contexts._.config.paths['strut/tagLibrary'], 'model', 'InitialTagLibraryDatabaseSetup.sql');
				let sql = fs.readFileSync(sqlFile, "utf8");
				db.exec(sql);
				db.close();
				return databaseFile;
			}
			catch (error)
			{
				alert(error);
			}
		}

		ElectronLibraryInterface.prototype = {

			/*  libraryItem : An array having entries as string , string , array of strings , string.
				Example : ['1.strut' , 'My First Presentation' , ['tag1' , 'tag2' , 'tag3'] , '']
				[filename , title , tagArray[] , history]
			*/
			insertNewLibraryItem: function(libraryItem)
			{
				let filename = libraryItem[0];
				let title = libraryItem[1];
				let tagsArray = libraryItem[2];
				let history = libraryItem[3];

				let db = new Database(this.databaseFile);
				db.pragma('foreign_keys = ON');
				db.prepare('BEGIN').run();
				db.prepare('SAVEPOINT savepoint_before_insert').run();
				try
				{
					db.prepare("INSERT INTO Presentations(id , title) VALUES(@id , @title);").run(
					{
						id: filename,
						title: title
					});
				}
				catch (error)
				{
					console.dir(error);
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_insert').run();
					db.close();
					throw error;
				}

				try
				{
					db.prepare("INSERT INTO Presentations_History(id , history) VALUES(@id , @history);").run(
					{
						id: filename,
						history: history
					});
				}
				catch (error)
				{
					console.dir(error);
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_insert').run();
					db.close();
					throw error;
				}

				/* Now we Insert Tags into the tables "Tags" and ignore errors. 
				   We also construct the next bunch of sql queries to executes
				*/

				let sqlPresentation_TagsArray = [];
				if (Array.isArray(tagsArray) && tagsArray.length > 0)
				{
					let tagLength = tagsArray.length;
					for (let i = 0; i < tagLength; i++)
					{
						try
						{
							sqlPresentation_TagsArray.push("INSERT INTO Presentations_Tags(id , tag) VALUES('" + filename + "' , '" + tagsArray[i] + "');");
							db.exec("INSERT OR IGNORE INTO Tags(tag) VALUES('" + tagsArray[i] + "');");
						}
						catch (error)
						{
							console.dir(error);
							continue;
						}
					}
				}
				else
				{
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_insert').run();
					db.close();
					throw new Error('Tags array is incorrect');
				}

				try
				{
					for (let i = 0; i < sqlPresentation_TagsArray.length; i++)
					{
						db.exec(sqlPresentation_TagsArray[i]);
					}
				}
				catch (error)
				{
					console.dir(error);
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_insert').run();
					db.close();
					throw error;
				}
				db.prepare('COMMIT').run();
				db.close();
			},

			getTextFromHTML: function(html)
			{
				let extractedText = "";
				let htmlToText = require('html-to-text');
				extractedText = htmlToText.fromString(html,
				{
					ignoreHref: true,
					ignoreImage: true
				});
				return extractedText;
			},

			getTagsFromText: function(text)
			{
				let vfile = require('to-vfile');
				let retext = require('retext');
				let keywords = require('retext-keywords');
				let nlcstToString = require('nlcst-to-string');
				let appPath = remote.app.getPath('userData');
				let filename = "temp.txt";
				let tempFilename = path.join(appPath, filename);
				fs.writeFileSync(tempFilename, text);
				let extractedTags = [];

				retext().use(keywords,
				{
					maximum: this.numTags
				}).process(vfile.readSync(tempFilename), function(err, file)
				{
					if (err) throw err;

					console.log("Retext-Keywords are : \n");
					file.data.keywords.forEach(function(keyword)
					{
						extractedTags.push(nlcstToString(keyword.matches[0].node));
					});
				});
				fs.unlinkSync(tempFilename);
				return extractedTags;
			},

			getAllTags: function()
			{
				try
				{
					let db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let result = db.prepare('Select tag from Tags').all();
					db.close();
					// let tagArray = _.pluck(result, 'tag');
					return result;
				}
				catch (error)
				{
					console.dir(error);
					db.close();
					throw error;
				}
			}
		};

		return ElectronLibraryInterface;
	});