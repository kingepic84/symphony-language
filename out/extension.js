"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const provider1 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position, token, context) {
            // a simple completion item which inserts `Hello World!`
            const funcs = new vscode.CompletionItem('function');
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
    const provider2 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `console.`
            // and if so then complete if `log`, `warn`, and `error`
            const lc = document.lineCount;
            const labelList = [];
            const complist = [];
            for (let index = 0; index < lc; index++) {
                const labelLine = document.lineAt(index);
                if (labelLine.text.match("label ")) {
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
    }, ' ' // triggered whenever a ' ' is being typed
    );
    const provider3 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            const lc = document.lineCount;
            const funcList = [];
            const complist = [];
            for (let index = 0; index < lc; index++) {
                const labelLine = document.lineAt(index);
                if (labelLine.text.match("function ")) {
                    const element = labelLine.text.slice(9);
                    funcList.push(element);
                }
            }
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
    }, ' ' // triggered whenever a ' ' is being typed
    );
    const provider4 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
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
    }, ' ' // triggered whenever a '.' is being typed
    );
    context.subscriptions.push(provider1, provider2, provider3, provider4);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map