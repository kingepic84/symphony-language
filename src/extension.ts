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
				
				const lc = document.lineCount;
				const funcList: string[] = [];
				const complist: any[] = [];
				for (let index = 0; index < lc; index++) {
					const labelLine = document.lineAt(index);
					if(labelLine.text.match("function ")){
						const elem = labelLine.text.slice(9);
						const elem2 = elem.replace(/\d+/," ");
						const element = elem2.trim();
						funcList.push(element);
					}
				}

				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('call ')) {
					return undefined;
				}
				for (let index = 0; index < funcList.length; index++) {
					const elem = new vscode.CompletionItem(funcList[index], vscode.CompletionItemKind.Method);
					elem.insertText = new vscode.SnippetString(funcList[index] + " " + "${1:NumArgs}");
					const doc: any = new vscode.MarkdownString("Calls the " + funcList[index] + " function with 'n' number of arguments");
					elem.documentation = doc;
					complist.push(elem);
				}
				return complist;
			}
		},
		' ' // triggered whenever a ' ' is being typed
	);
	const provider4 = vscode.languages.registerCompletionItemProvider(
		'symphony',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('push ') && !linePrefix.endsWith('pop ')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem('argument', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('constant', vscode.CompletionItemKind.Method),
					new vscode.CompletionItem('local', vscode.CompletionItemKind.Method),
				];
			}
		},
		' ' // triggered whenever a '.' is being typed
	);
	context.subscriptions.push(provider1, provider2, provider3, provider4);
}
