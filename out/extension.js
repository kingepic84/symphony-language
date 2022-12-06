"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    const provider1 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position, token, context) {
            // a simple completion item
            const funcs = new vscode.CompletionItem('function');
            funcs.insertText = new vscode.SnippetString("function ${1:FNAME} ${0:NumLocals}");
            const doc = new vscode.MarkdownString("Function Declarator");
            funcs.documentation = doc;
            const returns = new vscode.CompletionItem('return');
            const doc3 = new vscode.MarkdownString("Returns from a function and restores the topmost frame on the call stack");
            returns.documentation = doc3;
            const pushes = new vscode.CompletionItem('push');
            pushes.insertText = new vscode.SnippetString("push ${1|argument,constant,local,pointer,temp,this,that,static|} ${0:num}");
            const doc4 = new vscode.MarkdownString("Push onto the stack");
            pushes.documentation = doc4;
            const pops = new vscode.CompletionItem('pop');
            pops.insertText = new vscode.SnippetString("pop ${1|constant,local,pointer,temp,this,that,static|} ${0:num}");
            const doc5 = new vscode.MarkdownString("Pop off the stack");
            pops.documentation = doc5;
            const labels = new vscode.CompletionItem('label');
            labels.insertText = new vscode.SnippetString("label ${0:NAME}");
            const doc6 = new vscode.MarkdownString("Label declarator");
            labels.documentation = doc6;
            // return all completion items as array
            return [
                funcs,
                returns,
                pushes,
                pops,
                labels
            ];
        }
    });
    const provider2 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `if-goto`
            // and if so then complete with all labels created.
            const lc = document.lineCount;
            const labelList = [];
            const complist = [];
            for (let index = 0; index < lc; index++) {
                const labelLine = document.lineAt(index);
                if (labelLine.text.match("label ")) {
                    const elementcomm = labelLine.text;
                    if (elementcomm.includes("//")) {
                        const elementindex = elementcomm.indexOf("/");
                        if (elementindex == 0) {
                            0;
                        }
                        else {
                            const elemcomm = elementcomm.slice(0, elementindex).slice(6).trim();
                            labelList.push(elemcomm);
                        }
                    }
                    else {
                        const labeltext = labelLine.text.slice(6).trim();
                        labelList.push(labeltext);
                    }
                }
            }
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.startsWith('goto ')) {
                return undefined;
            }
            for (let index = 0; index < labelList.length; index++) {
                const elem = new vscode.CompletionItem(labelList[index], vscode.CompletionItemKind.Method);
                const doc = new vscode.MarkdownString("*Unconditional* jump to the " + "'**" + labelList[index] + "**'" + " label.");
                elem.documentation = doc;
                complist.push(elem);
            }
            return complist;
        }
    }, ' ' // triggered whenever a ' ' is being typed
    );
    const provider8 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            const lc = document.lineCount;
            const funcList = [];
            let funcstrings = "${1|";
            const caller = new vscode.CompletionItem("call");
            const doc = new vscode.MarkdownString("Calls a function");
            caller.documentation = doc;
            for (let index = 0; index < lc; index++) {
                const funcLine = document.lineAt(index);
                if (funcLine.text.match("function ")) {
                    const elementcomm = funcLine.text;
                    if (elementcomm.includes("//")) {
                        const elementindex = elementcomm.indexOf("/");
                        if (elementindex == 0) {
                            0;
                        }
                        else {
                            const elemcomm = elementcomm.slice(0, elementindex).trim();
                            const elem = elemcomm.replace(/\s\d+/, "").trim();
                            funcList.push(elem);
                        }
                    }
                    else {
                        const funcline = elementcomm.slice(9).trim();
                        const elem = funcline.replace(/\s\d+/, "").trim();
                        funcList.push(elem);
                    }
                }
            }
            for (let index = 0; index < funcList.length; index++) {
                funcstrings = funcstrings + funcList[index] + ",";
            }
            funcstrings = funcstrings.slice(0, (funcstrings.length - 1));
            funcstrings = funcstrings + "|}";
            caller.insertText = new vscode.SnippetString("call " + funcstrings + " ${0:NumArgs}");
            return [caller];
        }
    });
    const provider3 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            const lc = document.lineCount;
            const funcList = [];
            const complist = [];
            const argslist = [];
            for (let index = 0; index < lc; index++) {
                const funcLine = document.lineAt(index);
                if (funcLine.text.match("function ")) {
                    const elementcomm = funcLine.text;
                    if (elementcomm.includes("//")) {
                        const elementindex = elementcomm.indexOf("/");
                        if (elementindex == 0) {
                            0;
                        }
                        else {
                            const elemcomm = elementcomm.slice(0, elementindex).slice(9).trim();
                            const elem = elemcomm.replace(/\d+/, "").trim();
                            const numrep = elemcomm.replace(/(\D|\s\d)*/, "").trim();
                            argslist.push(numrep);
                            funcList.push(elem);
                        }
                    }
                    else {
                        const numrep = elementcomm.slice(9).replace(/(\D|\d\s)*/, "").trim();
                        argslist.push(numrep);
                        const elem = elementcomm.slice(9).replace(/\s\d+/, "").trim();
                        funcList.push(elem);
                    }
                }
            }
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('call ')) {
                return undefined;
            }
            else {
                for (let index = 0; index < funcList.length; index++) {
                    const elem = new vscode.CompletionItem(funcList[index], vscode.CompletionItemKind.Method);
                    elem.insertText = new vscode.SnippetString(funcList[index] + " " + "${0:NumArgs}");
                    const doc = new vscode.MarkdownString("Calls '**" + funcList[index] + "**' which can have up to **" + argslist[index] + "** arguments");
                    elem.documentation = doc;
                    complist.push(elem);
                }
            }
            return complist;
        }
    }, ' ' // triggered whenever a ' ' is being typed
    );
    const provider4 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `push` or `pop`
            // and if so then complete `argument`, `constant`, and `local`
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('push ')) {
                return undefined;
            }
            const cmd1 = new vscode.CompletionItem('argument', vscode.CompletionItemKind.Method);
            cmd1.insertText = new vscode.SnippetString("argument ${0:num}");
            const doc = new vscode.MarkdownString("Pushes 'argument {num}' to the top of the stack");
            cmd1.documentation = doc;
            const cmd2 = new vscode.CompletionItem('constant', vscode.CompletionItemKind.Method);
            cmd2.insertText = new vscode.SnippetString("constant ${0:num}");
            const doc2 = new vscode.MarkdownString("Pushes 'constant {num}' to the top of the stack");
            cmd2.documentation = doc2;
            const cmd3 = new vscode.CompletionItem('local', vscode.CompletionItemKind.Method);
            cmd3.insertText = new vscode.SnippetString("local ${0:num}");
            const doc3 = new vscode.MarkdownString("Pushes 'local {num}' to the top of the stack");
            cmd3.documentation = doc3;
            const cmd4 = new vscode.CompletionItem('static', vscode.CompletionItemKind.Method);
            cmd4.insertText = new vscode.SnippetString("static ${0:num}");
            const doc4 = new vscode.MarkdownString("Pushes 'static {num}' to the top of the stack");
            cmd4.documentation = doc4;
            const cmd5 = new vscode.CompletionItem('pointer', vscode.CompletionItemKind.Method);
            cmd5.insertText = new vscode.SnippetString("pointer ${0:num}");
            const doc5 = new vscode.MarkdownString("Pushes 'pointer {num}' to the top of the stack");
            cmd5.documentation = doc5;
            const cmd6 = new vscode.CompletionItem('this', vscode.CompletionItemKind.Method);
            cmd6.insertText = new vscode.SnippetString("this ${0:num}");
            const doc6 = new vscode.MarkdownString("Pushes 'this {num}' to the top of the stack");
            cmd6.documentation = doc6;
            const cmd7 = new vscode.CompletionItem('that', vscode.CompletionItemKind.Method);
            cmd7.insertText = new vscode.SnippetString("that ${0:num}");
            const doc7 = new vscode.MarkdownString("Pushes 'that {num}' to the top of the stack");
            cmd7.documentation = doc7;
            const cmd8 = new vscode.CompletionItem('temp', vscode.CompletionItemKind.Method);
            cmd8.insertText = new vscode.SnippetString("temp ${0:num}");
            const doc8 = new vscode.MarkdownString("Pushes 'temp {num}' to the top of the stack");
            cmd8.documentation = doc8;
            return [
                cmd1,
                cmd2,
                cmd3,
                cmd4,
                cmd5,
                cmd6,
                cmd7,
                cmd8
            ];
        }
    }, ' ' // triggered whenever a ' ' is being typed
    );
    const provider5 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `if-goto`
            // and if so then complete with all labels created.
            const lc = document.lineCount;
            const labelList = [];
            const complist = [];
            for (let index = 0; index < lc; index++) {
                const labelLine = document.lineAt(index);
                if (labelLine.text.match("label ")) {
                    const elementcomm = labelLine.text;
                    if (elementcomm.includes("//")) {
                        const elementindex = elementcomm.indexOf("/");
                        if (elementindex == 0) {
                            0;
                        }
                        else {
                            const elemcomm = elementcomm.slice(0, elementindex).slice(6).trim();
                            labelList.push(elemcomm);
                        }
                    }
                    else {
                        const labeltext = labelLine.text.slice(6).trim();
                        labelList.push(labeltext);
                    }
                }
            }
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.startsWith('if-goto ')) {
                return undefined;
            }
            for (let index = 0; index < labelList.length; index++) {
                const elem = new vscode.CompletionItem(labelList[index], vscode.CompletionItemKind.Method);
                const doc = new vscode.MarkdownString("*Conditional* jump to the " + "'**" + labelList[index] + "**'" + " label.");
                elem.documentation = doc;
                complist.push(elem);
            }
            return complist;
        }
    }, ' ' // triggered whenever a ' ' is being typed
    );
    const provider7 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `push or pop`
            // and if so then complete `argument`, `constant`, and `local`
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            const cmd1 = new vscode.CompletionItem('argument', vscode.CompletionItemKind.Method);
            cmd1.insertText = new vscode.SnippetString("argument ${0:num}");
            const doc = new vscode.MarkdownString("Pops the value on the top of the stack into 'argument {num}'");
            cmd1.documentation = doc;
            const cmd3 = new vscode.CompletionItem('local', vscode.CompletionItemKind.Method);
            cmd3.insertText = new vscode.SnippetString("local ${0:num}");
            const doc3 = new vscode.MarkdownString("Pops the value on the top of the stack into 'local {num}'");
            cmd3.documentation = doc3;
            const cmd4 = new vscode.CompletionItem('static', vscode.CompletionItemKind.Method);
            cmd4.insertText = new vscode.SnippetString("static ${0:num}");
            const doc4 = new vscode.MarkdownString("Pops the value on the top of the stack into 'static {num}'");
            cmd4.documentation = doc4;
            const cmd5 = new vscode.CompletionItem('pointer', vscode.CompletionItemKind.Method);
            cmd5.insertText = new vscode.SnippetString("pointer ${0:num}");
            const doc5 = new vscode.MarkdownString("Pops the value on the top of the stack into 'pointer {num}'");
            cmd5.documentation = doc5;
            const cmd6 = new vscode.CompletionItem('this', vscode.CompletionItemKind.Method);
            cmd6.insertText = new vscode.SnippetString("this ${0:num}");
            const doc6 = new vscode.MarkdownString("Pops the value on the top of the stack into 'this {num}'");
            cmd6.documentation = doc6;
            const cmd7 = new vscode.CompletionItem('that', vscode.CompletionItemKind.Method);
            cmd7.insertText = new vscode.SnippetString("that ${0:num}");
            const doc7 = new vscode.MarkdownString("Pops the value on the top of the stack into 'that {num}'");
            cmd7.documentation = doc7;
            const cmd8 = new vscode.CompletionItem('temp', vscode.CompletionItemKind.Method);
            cmd8.insertText = new vscode.SnippetString("temp ${0:num}");
            const doc8 = new vscode.MarkdownString("Pops the value on the top of the stack into 'temp {num}'");
            cmd8.documentation = doc8;
            if (!linePrefix.endsWith('pop ')) {
                return undefined;
            }
            return [
                cmd1,
                cmd3,
                cmd4,
                cmd5,
                cmd6,
                cmd7,
                cmd8
            ];
        }
    }, ' ' // triggered whenever a ' ' is being typed
    );
    const provider6 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `push or pop`
            // and if so then complete `argument`, `constant`, and `local`
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            const cmd1 = new vscode.CompletionItem('argument', vscode.CompletionItemKind.Method);
            cmd1.insertText = new vscode.SnippetString("argument ${0:num}");
            const doc = new vscode.MarkdownString("The argument segment");
            cmd1.documentation = doc;
            const cmd2 = new vscode.CompletionItem('constant', vscode.CompletionItemKind.Method);
            cmd2.insertText = new vscode.SnippetString("constant ${0:num}");
            const doc2 = new vscode.MarkdownString("The constant segment");
            cmd2.documentation = doc2;
            const cmd3 = new vscode.CompletionItem('local', vscode.CompletionItemKind.Method);
            cmd3.insertText = new vscode.SnippetString("local ${0:num}");
            const doc3 = new vscode.MarkdownString("The local segment");
            cmd3.documentation = doc3;
            if (!linePrefix.endsWith('pop a') && !linePrefix.endsWith('pop l') && !linePrefix.endsWith('push c') && !linePrefix.endsWith('push l') && !linePrefix.endsWith('push a')) {
                return undefined;
            }
            return [
                cmd1,
                cmd2,
                cmd3
            ];
        }
    });
    const provider9 = vscode.languages.registerCompletionItemProvider('symphony', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `goto`
            // and if so then complete with all created labels
            const lc = document.lineCount;
            const labelList = [];
            const complist = [];
            let jumps = "${1|";
            const jumpy = new vscode.CompletionItem('goto');
            const doc7 = new vscode.MarkdownString("Unconditional Jump");
            const condjumps = new vscode.CompletionItem('if-goto');
            const doc8 = new vscode.MarkdownString("Conditional Jump");
            condjumps.documentation = doc8;
            jumpy.documentation = doc7;
            for (let index = 0; index < lc; index++) {
                const labelLine = document.lineAt(index);
                if (labelLine.text.match("label ")) {
                    const elementcomm = labelLine.text;
                    if (elementcomm.includes("//")) {
                        const elementindex = elementcomm.indexOf("/");
                        if (elementindex == 0) {
                            0;
                        }
                        else {
                            const elemcomm = elementcomm.slice(0, elementindex).slice(6).trim();
                            labelList.push(elemcomm);
                        }
                    }
                    else {
                        const labeltext = labelLine.text.slice(6).trim();
                        labelList.push(labeltext);
                    }
                }
            }
            for (let index = 0; index < labelList.length; index++) {
                jumps = jumps + labelList[index] + ",";
            }
            jumps = (jumps.slice(0, (jumps.length - 1))) + "|}";
            jumpy.insertText = new vscode.SnippetString("goto " + jumps);
            condjumps.insertText = new vscode.SnippetString("if-goto " + jumps);
            return [condjumps, jumpy];
        }
    });
    context.subscriptions.push(provider1, provider2, provider3, provider4, provider5, provider6, provider7, provider8, provider9);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map