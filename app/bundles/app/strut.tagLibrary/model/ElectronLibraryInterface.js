define(['lodash'],
	function(_)
	{
		'use strict';

		/* The job of this interface/class is as follows : 

				It creates a Database file, where our Database and its tables will be created.
				We will have 4 tables as follows : 
				1. Presentations (id , title , thumbnailSlide);
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
			let databaseFile = window.sessionMeta.tagLibraryDatabaseFile;
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

			/*  libraryItem : A json obect as follows
				{
					filename: '1.strut' (a string which is the name of the file),
					title: 'My First Presentation' (a string which is the title of the file), 
					tags: ['tag1' , 'tag2' , 'tag3'] (an array of strings where each string is a tag),
					history: '2.strut' (a string or null),
					thumbnailSlide: 3 (a number)
				}
			*/
			insertNewLibraryItem: function(libraryItem)
			{
				let filename = libraryItem.filename;
				let title = libraryItem.title;
				let tagsArray = libraryItem.tags;
				let history = libraryItem.history;
				let thumbnailSlide = libraryItem.thumbnailSlide;

				let db = new Database(this.databaseFile);
				db.prepare('BEGIN').run();
				db.prepare('SAVEPOINT savepoint_before_insert').run();
				db.pragma('foreign_keys = ON');
				try
				{
					db.prepare("INSERT INTO Presentations(id , title , thumbnailSlide) VALUES(@id , @title , @thumbnailSlide);").run(
					{
						id: filename,
						title: title,
						thumbnailSlide: thumbnailSlide
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

				/* Now we Insert Tags into the tables "Tags" and ignore errors because these tags could already be existing in the Tags table..
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

			/*  libraryItem : A json obect as follows
				{
					filename: '1.strut' (a string which is the name of the file),
					title: 'My First Presentation' (a string which is the title of the file), 
					tags: ['tag1' , 'tag2' , 'tag3'] (an array of strings where each string is a tag),
					deleteHistory: boolean (true or false) indicating whether to delete history items,
					thumbnailSlide: 3 (a number)
				}
			*/
			updateLibraryItem: function(libraryItem, oldFileName)
			{
				/* PLEASE NOTE : 
				   We have created the tables using a cascade update on all the tables from the "Presentations" table.
				   Thus, when we do the first update on the "Presentations" table, it triggers an update on all other tables.
				   So, only for the first update we need the oldFileName in the WHERE clause.
				   After that, our where clause uses the new filename.
				*/
				let filename = libraryItem.filename;
				let title = libraryItem.title;
				let tagsArray = libraryItem.tags;
				let deleteHistory = libraryItem.deleteHistory;
				let thumbnailSlide = libraryItem.thumbnailSlide;

				let db = new Database(this.databaseFile);
				db.pragma('foreign_keys = ON');
				db.prepare('BEGIN').run();
				db.prepare('SAVEPOINT savepoint_before_update').run();
				try
				{
					db.prepare(`UPDATE Presentations SET
					id = @id, 
					title = @title,
					thumbnailSlide = @thumbnailSlide
					WHERE id = @oldFileName;`).run(
					{
						id: filename,
						title: title,
						thumbnailSlide: thumbnailSlide,
						oldFileName: oldFileName
					});
				}
				catch (error)
				{
					console.dir(error);
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_update').run();
					db.close();
					throw error;
				}

				try
				{
					if (deleteHistory)
					{
						db.prepare(`DELETE FROM Presentations_History WHERE id=@id`).run(
						{
							id: filename,
						});
					}
				}
				catch (error)
				{
					console.dir(error);
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_update').run();
					db.close();
					throw error;
				}

				/* Now we first delete all tags and insert new tags into the tables "Presentations_Tags" for this id.
				   Next we insert tags into the "Tags table "and ignore errors because these tags could already be existing in the Tags table.
				*/

				try
				{
					db.prepare("DELETE FROM Presentations_Tags WHERE id=@id").run(
					{
						id: filename
					});
				}
				catch (error)
				{
					console.dir(error);
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_update').run();
					db.close();
					throw error;
				}

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
					db.prepare('ROLLBACK TO SAVEPOINT savepoint_before_update').run();
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
				try
				{
					let numTags = this.numTags;
					let vfile = require('to-vfile');
					let retext = require('retext');
					let keywords = require('retext-keywords');
					let nlcstToString = require('nlcst-to-string');
					let appPath = window.sessionMeta.appPath;
					let filename = "temp.txt";
					let tempFilename = path.join(appPath, filename);
					fs.writeFileSync(tempFilename, text);
					let extractedTags = [];

					retext().use(keywords,
					{
						maximum: numTags
					}).process(vfile.readSync(tempFilename), function(err, file)
					{
						if (err) throw err;

						console.log("Retext-Keywords are : \n");
						file.data.keywords.forEach(function(keyword)
						{
							if (extractedTags.length > numTags)
							{
								return;
							}
							extractedTags.push(nlcstToString(keyword.matches[0].node));
						});
					});
					fs.unlinkSync(tempFilename);
					return extractedTags;
				}
				catch (error)
				{
					console.log(error);
					throw error;
				}
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
			},

			getAllLibraryItems: function()
			{
				try
				{
					var db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let results = db.prepare(`
					SELECT p.id AS file, p.title AS title, p.thumbnailSlide AS thumbnailSlide, GROUP_CONCAT(pt.tag) AS tags, GROUP_CONCAT(ph.history) AS history
					FROM Presentations AS p
					INNER JOIN Presentations_Tags AS pt on p.id = pt.id
					INNER JOIN Presentations_History AS ph on p.id = ph.id
					GROUP BY p.id`).all();
					db.close();
					return results;
				}
				catch (error)
				{
					throw error;
				}
			},

			deleteLibraryItem: function(filename)
			{
				try
				{
					var db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let results = db.prepare("DELETE FROM Presentations WHERE id=@id").run(
					{
						id: filename
					});
					db.close();
					return results;
				}
				catch (error)
				{
					throw error;
				}
			},

			getAllDataForThisFile(filename)
			{
				try
				{
					var db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let results = db.prepare(`
					SELECT p.id AS file, p.title AS title , p.thumbnailSlide AS thumbnailSlide , GROUP_CONCAT(pt.tag) AS tags, GROUP_CONCAT(ph.history) AS history
					FROM Presentations AS p
					INNER JOIN Presentations_Tags AS pt on p.id = pt.id
					INNER JOIN Presentations_History AS ph on p.id = ph.id
					WHERE p.id = @file
					GROUP BY p.id`).get(
					{
						file: filename
					});
					db.close();
					return results;
				}
				catch (error)
				{
					throw error;
				}
			},

			searchAndDisplayItemsByFile: function(fileToSearch)
			{
				try
				{
					var db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let results = db.prepare(`
					SELECT p.id AS file, p.title AS title , p.thumbnailSlide AS thumbnailSlide , GROUP_CONCAT(pt.tag) AS tags, GROUP_CONCAT(ph.history) AS history
					FROM Presentations AS p
					INNER JOIN Presentations_Tags AS pt on p.id = pt.id
					INNER JOIN Presentations_History AS ph on p.id = ph.id
					WHERE p.id LIKE '%'||$file||'%'
					GROUP BY p.id`).all(
					{
						file: fileToSearch
					});
					db.close();
					return results;
				}
				catch (error)
				{
					throw error;
				}
			},

			searchAndDisplayItemsByTitle: function(titleToSearch)
			{
				try
				{
					var db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let results = db.prepare(`
					SELECT p.id AS file, p.title AS title , p.thumbnailSlide AS thumbnailSlide , GROUP_CONCAT(pt.tag) AS tags, GROUP_CONCAT(ph.history) AS history
					FROM Presentations AS p
					INNER JOIN Presentations_Tags AS pt on p.id = pt.id
					INNER JOIN Presentations_History AS ph on p.id = ph.id
					WHERE p.title LIKE '%'||$title||'%'
					GROUP BY p.id`).all(
					{
						title: titleToSearch
					});
					db.close();
					return results;
				}
				catch (error)
				{
					throw error;
				}
			},

			searchAndDisplayItemsByHistory: function(historyToSearch)
			{
				try
				{
					var db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let results = db.prepare(`
					SELECT p.id AS file, p.title AS title , p.thumbnailSlide AS thumbnailSlide, GROUP_CONCAT(pt.tag) AS tags, GROUP_CONCAT(ph.history) AS history
					FROM Presentations AS p
					INNER JOIN Presentations_Tags AS pt on p.id = pt.id
					INNER JOIN Presentations_History AS ph on p.id = ph.id
					WHERE ph.history LIKE '%'||$history||'%'
					GROUP BY p.id`).all(
					{
						history: historyToSearch
					});
					db.close();
					return results;
				}
				catch (error)
				{
					throw error;
				}
			},

			searchAndDisplayItemsByTags: function(tagsArrayToSearch)
			{
				let tagsClause = "'" + tagsArrayToSearch.join("','") + "'";
				try
				{
					var db = new Database(this.databaseFile);
					db.pragma('foreign_keys = ON');
					let results = db.prepare(`
					SELECT p.id AS file, p.title AS title , p.thumbnailSlide AS thumbnailSlide , GROUP_CONCAT(pt.tag) AS tags, GROUP_CONCAT(ph.history) AS history
					FROM Presentations AS p
					INNER JOIN Presentations_Tags AS pt on p.id = pt.id
					INNER JOIN Presentations_History AS ph on p.id = ph.id
					INNER JOIN
					(
						Select p.id as id, count(p.id) as count
						FROM Presentations AS p
						INNER JOIN Presentations_Tags AS pt on p.id = pt.id
						where pt.tag IN (` + tagsClause + `)
						GROUP BY p.id
					) AS x on x.id = p.id
					GROUP BY p.id
					ORDER BY x.count desc`).all();
					db.close();
					return results;
				}
				catch (error)
				{
					throw error;
				}
			},
		};

		return ElectronLibraryInterface;
	});