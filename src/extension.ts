// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const executeIcon = new vscode.ThemeIcon("debug-alt", new vscode.ThemeColor("#98cf8c"));


console.log(executeIcon);

const settins = vscode.workspace.getConfiguration("run-qunit");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "run-qunit" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('run-qunit.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from run-qunit!');
	});

	context.subscriptions.push(disposable);
	// 在当前活动的编辑器中添加图标
	
	// 在命令注册时调用该函数
	disposable = vscode.commands.registerCommand('run-qunit.runaction', () => {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return
		}
		let path = editor?.document.uri.path
		if (path.endsWith("action.ts")) {
			let start = path.indexOf("/static-file/test/");
			let urlPath = path.substring(start + "/static-file/test/".length, path.lastIndexOf('.'));
			let position = editor.selection.active;
			let line = position.line;
			let startLine = line, endLine = line;
			let document = editor.document;
			let max = document.lineCount;
			let getFuncName = (lineNumber: number) => {
				let value = document.lineAt(lineNumber)?.text;
				if (!value) {
					return;

				}
				let funcIndex = value.indexOf("export function test");
				if (funcIndex == -1) {
					return;
				}
				let funcEnd = value.indexOf("(assert: Assert)");
				if (funcEnd != -1) {
					return value.substring(funcIndex + "export function test_".length, funcEnd );
				}
			}
			let funcName;
			while (startLine > 0 || endLine <= max) {
				if (startLine > 0) {
					funcName = getFuncName(startLine);
					if (funcName) {
						break;
					}
					if (startLine == endLine) {
						endLine++;
					}
					startLine--;
				}
				if (endLine < max) {
					let text = document.lineAt(endLine)?.text
					if (text == '}') {
						endLine = max;
						continue;
					}
					funcName = getFuncName(endLine);
					if (funcName) {
						break;
					}
					endLine++;
				}
			}

			let url = `http://127.0.0.1:8080/test/${urlPath}?filter=${funcName}`;
			vscode.env.openExternal(vscode.Uri.parse(url));
		}

	});
	context.subscriptions.push(disposable);


}

// This method is called when your extension is deactivated
export function deactivate() { }
