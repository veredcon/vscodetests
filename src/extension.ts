import * as vscode from 'vscode';

let channel: vscode.OutputChannel;
export function getOutputChannel(): vscode.OutputChannel {
	if (!channel) {
		setOutputChannel(vscode.window.createOutputChannel('Hello World Plugin'));
	}
	return channel;
}

export function setOutputChannel(outputChannel: vscode.OutputChannel) {
    channel = outputChannel;
}

export async function activate(context: vscode.ExtensionContext) {
	getOutputChannel().appendLine('Congratulations, your extension "helloworld-sample" is now active!');

	let disposable = vscode.commands.registerCommand('extension.showDialog', async (uri: vscode.Uri) => {
		getOutputChannel().appendLine('Start show Dialog');
		let filepath = uri.fsPath;
		if (filepath.endsWith('.json')) {
			filepath = filepath.replace('.json', '.txt');
		}
		const defaultUri: vscode.Uri = vscode.Uri.file(filepath);
		getOutputChannel().appendLine('defaultUri for the dialog is:' + defaultUri);
		const options: vscode.SaveDialogOptions = { defaultUri, filters: {} }; 
		vscode.window.showSaveDialog(options).then(async (fileUri: any) => {
			if (fileUri) {
				vscode.window.showInformationMessage('Save file path:' + fileUri.fsPath);
			}
			else {
				vscode.window.showInformationMessage('Save dialog has been closed');
			}
			
		});
	});
	getOutputChannel().appendLine('registered hello-world command');

	// The problem is that the explorer isn't represented in the API, 
	// e.g. there no explorer selection events etc. that would enable to update those context keys
	context.subscriptions.push(disposable);
}

export function deactivate() {}