#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Command } = require("commander");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");
const program = new Command();
console.log(figlet.textSync("Pranav's  CLI"));
program
    .version("1.0.0")
    .description("A CLI for working with a directory")
    .option("-l, --ls [value] ", "List directory contents")
    .option("-m, --mkdir <value> ", "Makes a new Directory")
    .option("-t, --touch <value> ", "Creates a file").
    parse(process.argv);
const options = program.opts();
//We will define this function
//We want the --l command to show us, 
// Filename
// Size of the file
// File created_at 
function listDirectoryFiles(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs.promises.readdir(filepath);
            const detailedFilesPromises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                let fileDetails = yield fs.promises.lstat(path.resolve(filepath, file));
                const { size, birthtime } = fileDetails;
                return { filename: file, "size(KB)": size, created_at: birthtime };
            }));
            const detailedFiles = yield Promise.all(detailedFilesPromises);
            console.table(detailedFiles);
        }
        catch (e) {
            console.log("Error occurred while reading the directory!", e);
        }
    });
}
function createDirectory(filepath) {
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath);
        console.log("The Directory has been created successfully");
    }
}
function createFile(filepath) {
    fs.openSync(filepath, "w");
    console.log("An open file has been created");
}
//check which option the user has used
if (options.ls) {
    const filepath = typeof options.ls === "string" ? options.ls : __dirname;
    listDirectoryFiles(filepath);
}
if (options.mkdir) {
    createDirectory(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
    createFile(path.resolve(__dirname, options.touch));
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map