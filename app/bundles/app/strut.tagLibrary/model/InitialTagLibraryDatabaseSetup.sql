CREATE TABLE IF NOT EXISTS Presentations
(
	id text NOT NULL UNIQUE,
	title text,
	thumbnailSlide integer NOT NULL default 1,
	CONSTRAINT PK_Presentations_id PRIMARY KEY (id)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS Tags
(
	tag text NOT NULL UNIQUE,
	CONSTRAINT PK_Tags_tag PRIMARY KEY (tag)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS Presentations_Tags
(
	id text NOT NULL,
	tag text NOT NULL,
	CONSTRAINT PK_Presentations_Tags PRIMARY KEY (id, tag),
	CONSTRAINT FK_Presentations_Tags_id FOREIGN KEY(id) REFERENCES Presentations(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK_Presentations_Tags_tag FOREIGN KEY(tag) REFERENCES Tags(tag) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS Presentations_History
(
	id text NOT NULL UNIQUE,
	history text,
	CONSTRAINT PK_Presentations_History_id PRIMARY KEY (id),
	CONSTRAINT PK_Presentations_History_id FOREIGN KEY(id) REFERENCES Presentations(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT FK_Presentations_History_history FOREIGN KEY(history) REFERENCES Presentations(id) ON DELETE CASCADE ON UPDATE CASCADE
) WITHOUT ROWID;