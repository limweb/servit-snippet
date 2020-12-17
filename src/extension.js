const vscode = require('vscode'); 
const pkg  = require('../package.json');
function activate(context) {
	console.log('Congratulations, your extension "tlen-ext" is now active!');
	let disposable = vscode.commands.registerCommand('tlen-ext.tlenVersion', function() {
		console.log('pkg version--->',pkg.version);
		vscode.window.showInformationMessage('Tlen version: '+ pkg.version );
	});
	context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}
module.exports = {
	activate,
	deactivate
}
