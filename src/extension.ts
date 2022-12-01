/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const provider1 = vscode.languages.registerCompletionItemProvider('symphony', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			// a simple completion item which inserts `Hello World!`
			const funcs= new vscode.CompletionItem('function');
			const calls = new vscode.CompletionItem('call');
			const returns = new vscode.CompletionItem('return');
			const pushes = new vscode.CompletionItem('push');
			const pops = new vscode.CompletionItem('pop');
			const labels = new vscode.CompletionItem('label');
			const jumps = new vscode.CompletionItem('goto');
			const condjumps = new vscode.CompletionItem('if-goto');
			// // a completion item that inserts its text as snippet,
			// // the `insertText`-property is a `SnippetString` which will be
			// // honored by the editor.
			// const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			// snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
			// const docs: any = new vscode.MarkdownString("Inserts a snippet that lets you select [link](x.ts).");
			// snippetCompletion.documentation = docs;
			// docs.baseUri = vscode.Uri.parse('http://example.com/a/b/c/');

			// // a completion item that can be accepted by a commit character,
			// // the `commitCharacters`-property is set which means that the completion will
			// // be inserted and then the character will be typed.
			// const commitCharacterCompletion = new vscode.CompletionItem('console');
			// commitCharacterCompletion.commitCharacters = ['.'];
			// commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

			// // a completion item that retriggers IntelliSense when being accepted,
			// // the `command`-property is set which the editor will execute after 
			// // completion has been inserted. Also, the `insertText` is set so that 
			// // a space is inserted after `new`
			// const commandCompletion = new vscode.CompletionItem('new');
			// commandCompletion.kind = vscode.CompletionItemKind.Keyword;
			// commandCompletion.insertText = 'new ';
			// commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

			// return all completion items as array
			return [
				funcs,
				calls,
				returns,
				pushes,
				pops,
				jumps,
				condjumps,
				labels
				// snippetCompletion,
				// commitCharacterCompletion,
				// commandCompletion
			];
		}
	});

	const provider2 = vscode.languages.registerCompletionItemProvider(
		'symphony',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				
				const lc = document.lineCount;
				const labelList: string[] = [];
				const complist: any[] = [];
				for (let index = 0; index < lc; index++) {
					const labelLine = document.lineAt(index);
					if(labelLine.text.match("label ")){
						const element = labelLine.text.slice(6);
						labelList.push(element);
					}
				}

				// if(labelcheck.includes("label ")){
				// 	const labelindex = labelcheck.indexOf("label");

				// }
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('goto ')) {
					return undefined;
				}
				for (let index = 0; index < labelList.length; index++) {
					const elem = new vscode.CompletionItem(labelList[index], vscode.CompletionItemKind.Method);
					complist.push(elem);
				}
				return complist;
			}
		},
		' ' // triggered whenever a ' ' is being typed
	);
	const provider3 = vscode.languages.registerCompletionItemProvider(
		'symphony',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				
				const lc = document.lineCount;
				const funcList: string[] = [];
				const complist: any[] = [];
				for (let index = 0; index < lc; index++) {
					const labelLine = document.lineAt(index);
					if(labelLine.text.match("function ")){
						const element = labelLine.text.slice(9);
						funcList.push(element);
					}
				}

				// if(labelcheck.includes("label ")){
				// 	const labelindex = labelcheck.indexOf("label");

				// }
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('call ')) {
					return undefined;
				}
				for (let index = 0; index < funcList.length; index++) {
					const elem = new vscode.CompletionItem(funcList[index], vscode.CompletionItemKind.Method);
					complist.push(elem);
				}
				return complist;
			}
		},
		' ' // triggered whenever a ' ' is being typed
	);

	context.subscriptions.push(provider1, provider2);
}
