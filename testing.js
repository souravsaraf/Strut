var Database = require('better-sqlite3');
var db = new Database('C:\\Users\\SouravSaraf\\AppData\\Roaming\\Strut\\strutTagLibrary.db');

db.pragma('foreign_keys = ON');
db.exec("INSERT INTO Presentations VALUES('C:\\Users\\SouravSaraf\\Documents\\food.strut' , 'ppt on foodies');");

let results = db.prepare('Select * from Presentations').all();
console.log("Presentations Table : \n");
console.dir(results);

results = db.prepare('Select * from Presentations_History').all();
console.log("Presentations_History Table : \n");
console.dir(results);

results = db.prepare('Select * from Presentations_Tags').all();
console.log("Presentations_Tags Table : \n");
console.dir(results);

results = db.prepare('Select * from Tags').all();
console.log("Tags Table : \n");
console.dir(results);

db.close();