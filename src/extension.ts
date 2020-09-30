import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let channel: vscode.OutputChannel;
const OUT_FOLDER = '_out';

export function getOutputChannel(): vscode.OutputChannel {
	if (!channel) {
		setOutputChannel(vscode.window.createOutputChannel('Hello World Plugin'));
	}
	return channel;
}

export function setOutputChannel(outputChannel: vscode.OutputChannel) {
    channel = outputChannel;
}

export function getWorkspaceFolder(srcFile: vscode.Uri) {
    const wsFolder = vscode.workspace.getWorkspaceFolder(srcFile);
    return (wsFolder ? wsFolder.uri.fsPath : path.dirname(srcFile.fsPath));
}

export function showTextDocument(doc: vscode.TextDocument) {
    const options: vscode.TextDocumentShowOptions = {
        preview: true,
        selection: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0)) // force editor to scroll to top
    }

    // if (this.checkUserSetting(USER_SETTINGS.sideBySide)) {
        const visibleEditors = vscode.window.visibleTextEditors.filter(editor => typeof editor.viewColumn === 'number');
        options.viewColumn = (visibleEditors && visibleEditors[0] && visibleEditors[0].viewColumn ? visibleEditors[0].viewColumn + 1 : 1);
        options.preserveFocus = true;
    // }

    return vscode.window.showTextDocument(doc, options);
}

export async function activate(context: vscode.ExtensionContext) {
	getOutputChannel().appendLine('Congratulations, your extension "helloworld-sample" is now active!');

	let disposable = vscode.commands.registerCommand('extension.showTextEditorTest', async (srcFile: vscode.Uri) => {
		getOutputChannel().appendLine('Start show Text Editor');
        try {
            const projectFolder = getWorkspaceFolder(srcFile);
            const projectRelPath = path.relative(projectFolder, path.dirname(srcFile.fsPath));
            const fileName = path.basename(srcFile.fsPath).replace(/\..*$/, '');
            const fileExtension = 'json';
            const destFile = path.join(projectFolder, OUT_FOLDER, projectRelPath, `${fileName}.${fileExtension}`);

            // creates the file and save content
            fs.mkdirSync(path.dirname(destFile), {recursive: true});
            fs.writeFileSync(destFile, '{"key": true}');
			getOutputChannel().appendLine('File was created' + destFile);

             let visibleTextEditors = vscode.window.visibleTextEditors;
			getOutputChannel().appendLine('number of visibleTextEditors is: ' + visibleTextEditors.length);

            const doc = await vscode.workspace.openTextDocument(destFile);
            await showTextDocument(doc);
            visibleTextEditors = vscode.window.visibleTextEditors;
            getOutputChannel().appendLine('number of visibleTextEditors after openning newly created file is: ' + visibleTextEditors.length);
        }
        catch (error) {
            getOutputChannel().appendLine('The following error occured:' + error);
            vscode.window.showErrorMessage(error);
        }
	});
	getOutputChannel().appendLine('registered hello-world command');
	context.subscriptions.push(disposable);
}

export function deactivate() {}