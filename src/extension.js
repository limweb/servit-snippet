const vscode = require('vscode'); 
function activate(context) {
	console.log('Congratulations, your extension "tlen-ext" is now active!');
	let disposable = vscode.commands.registerCommand('tlen-ext.tlenVersion', function() {
		vscode.window.showInformationMessage('Tlen version: 0.0.2');
	});
	context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}
module.exports = {
	activate,
	deactivate
}
