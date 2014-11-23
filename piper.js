var child_process = require('child_process');
var minimalist = require('minimist');

var input_text = "git";

var segments = input_text.split('|');

var processes = [];
var count = 0;

for (var i in segments) {
	var pieces = segments[i].split(/\s/g);
	
	var cmd = pieces.shift();
	while (!cmd) cmd = pieces.shift();

	for (var i in pieces) 
		if (!pieces[i]) pieces.splice(i, 1);

	pieces.push('');
	var proc = child_process.spawn(cmd, pieces);
	proc.on('error', function(e) {console.log(e)})
	var p = {cmd:cmd, args: pieces, proc: proc};
	processes.push(p);

}

function attach_two( p1, p2 ){
	p1.stdout.on('data', function(data) {
		p2.stdin.write(data);
		p1.stdin.end();
	})
	p1.stderr.on('data', function(data) {
		console.log('error :'+data);
	})
	p1.on('close', function(code) {
		p2.stdin.end();
	})
}

for (var i=0; i< processes.length; i++) 
{
	var current = processes[i].proc;
	var cur_ob = processes[i];
	if (processes[i+1]) 
	{
		var next = processes[i+1].proc;
		attach_two(current, next)
	}
	else 
	{
		current.stdout.on('data', function(data) {
			console.log(''+data);
		})
		current.stderr.on('data', function(data) {
			console.log(''+data);
		})
		current.on('close', function(code) {
		})
	}
}
