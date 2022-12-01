# Symphony, a stack language.

This extension offers extensive syntax highlighting and Intellisense autocomplete for the SYMPHONY stack language.

## Features

- Highlights keywords such as `function`, `label`, `goto`, and more.
- Highlights the label names and function names such as `function main` and `label GO_HERE`.
- Highlights the logical and mathematical operators such as `and`, `le`, `sub`, and more.
- Highlights and Autocompletes the stack commands, `push` and `pop`.
- Automatically completes the `goto`, `if-goto`, and `call` statements with their respective names. Ex: For `label here`, typing `goto` and pressing space would generate `here` as an autocomplete option.  

## Requirements

No requirements, just install the extension, restart VS Code, and enjoy Syntax Highlighting and Autocomplete for the Symphony Language!

## Release Notes

### 0.0.1

Initial release of The Symphony stack language,

### 0.0.2

Added support for label pointers and block comments instead of only single line comments.

### 0.0.3

Separated the highlights between the mathematical operators, the logical operators, and the size operators.

### 1.0.0

FULL RELEASE!!! Apart from Syntax Highlighting, this extension now offers ***INTELLISENSE AUTOCOMPLETE!!!*** This means that whenever you create labels, and you use the `goto` and `if-goto` statements, it will give you a list of the labels you already created to pick from! The same goes for functions, whenever you invoke `call` it will give you a list of the function names you created and autocomplete them for you!

### 1.0.1 

Fixed a small bug with function call autocomplete. 

### 1.0.2

Added documentation to the Intellisense.

### 1.1.0

Created Intellisense snippets based on current labels and functions, and added snippets for push and pop as well.

**Enjoy the Extension!**
