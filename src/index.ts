#! /usr/bin/env node

const {Command} = require("commander"); 
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");
const program = new Command();


console.log(figlet.textSync("Pranav's  CLI"))

program 
.version("1.0.0")
.description("A CLI for working with a directory")
.option("-l, --ls [value] ","List directory contents")
.option("-m, --mkdir <value> ","Makes a new Directory")
.option("-t, --touch <value> ","Creates a file").
parse(process.argv)

const options = program.opts();

//We will define this function

//We want the --l command to show us, 
// Filename
// Size of the file
// File created_at 

async function listDirectoryFiles(filepath:string): Promise<void>
{
    try{
    const files = await fs.promises.readdir(filepath);
    const detailedFilesPromises = files.map(async(file:string)=>{
        let fileDetails = await fs.promises.lstat(path.resolve(filepath,file));
        const {size,birthtime } = fileDetails;
        return {filename:file,"size(KB)":size,created_at:birthtime};
    });
    const detailedFiles = await Promise.all(detailedFilesPromises);
    console.table(detailedFiles);
    }
    catch(e){
    console.log("Error occurred while reading the directory!",e)
    }
}


function createDirectory(filepath:string){
    if(!fs.existsSync(filepath)){
        fs.mkdirSync(filepath);
        console.log("The Directory has been created successfully");
    }
}

function createFile(filepath:string){
    fs.openSync(filepath,"w");
    console.log("An open file has been created");
}


//check which option the user has used

if(options.ls){
    const filepath = typeof options.ls === "string" ? options.ls:__dirname;
    listDirectoryFiles(filepath)
}

if(options.mkdir){
    createDirectory(path.resolve(__dirname,options.mkdir));
}

if(options.touch){
    createFile(path.resolve(__dirname,options.touch));
}

if(!process.argv.slice(2).length){
    program.outputHelp();   
}
