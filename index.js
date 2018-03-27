
// 2. retext-keywords

let input_filename = process.argv[2];

const vfile = require('to-vfile');
const retext = require('retext');
const keywords = require('retext-keywords');
const nlcstToString = require('nlcst-to-string');

let answer = "";
retext()
	.use(keywords , {maximum : 10})
	.process(vfile.readSync(input_filename), function (err, file) {
		if (err) throw err;
		
		answer += "\nretext-keywords : \n";
		file.data.keywords.forEach(function (keyword) {
		answer += nlcstToString(keyword.matches[0].node) + ' ';
		});
	}
);
console.log(answer);

// 3. 
