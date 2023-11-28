'use strict';

const colors = require('colors');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_FILE = "config.json";

function readResource(filePath) {
  const fullPath = path.join(__dirname, filePath);
  try { 
    return fs.readFileSync(fullPath, 'utf8').trim();
  } catch {
    console.log(colors.red(`File not found: ${fullPath}`));
    return '';
  }
}

function getVersion() {
  return readResource('.version');   
}

function saveConfig(imageFolder, outputFile) {
  const config = {imageFolder, outputFile};
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));  
}

function loadConfig() {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    const {imageFolder, outputFile} = JSON.parse(data);
    return [imageFolder, outputFile];
  } catch {
    return [null, null]; 
  }
}

function imageToCppArray(imagePath, variableName) {
  const imageData = fs.readFileSync(imagePath);
  const cppArray = imageData.toString('hex').replace(/(..)/g, '0x$1, ');
  
  let cppCode = `unsigned char ${variableName}[] = {\n    ${cppArray}}\n};\n`; 
  cppCode += `size_t ${variableName}Size = sizeof(${variableName});\n`;
  
  return cppCode;
}

function processImagesInFolder(folderPath) {
  let cppCode = '';
  
  fs.readdirSync(folderPath).forEach(filename => {
    if (filename.toLowerCase().endsWith('.png')) {
      const imagePath = path.join(folderPath, filename);
      const variableName = path.basename(filename, '.png') + '1';
      
      cppCode += imageToCppArray(imagePath, variableName);
    }
  });
  
  return cppCode; 
}

function generateImageCppCode(imageFolder, outputFile) {
  const cppCode = processImagesInFolder(imageFolder);
  
  fs.writeFileSync(outputFile, cppCode);
  
  console.log(`C++ code saved to ${outputFile}`);
}

function printHelp() {
  console.log(`Version: ${getVersion()}`);
  
  console.log(colors.cyan(`
    Usage:  
      imfont -f <font.ttf> -o <output_name>
      imfont -i -f <image_folder> -o <output_file>
    
    Options:    
      -f, --file <font.ttf>        Input file for imfont tool
      -o, --output <output_name>   Output name for imfont tool
      -i, --image                  Use image to C++ array tool
      -h, --help                   Show this help message
  `));
}

function printAsciiArt() {
  console.log(colors.red(`\n\n`));
  
  console.log(colors.green(`(GITHUB: ${colors.magenta('HK4CRPRASAD')} )`)); 
  
  console.log(colors.blue('MADE BY HK4CRPRASAD'));
  
  console.log(colors.yellow(`Version: ${getVersion()}\n\n`));    
}


function promptInput(message) {
  const { stdin, stdout } = process;
  
  return new Promise(resolve => {
    stdout.write(message);
    
    stdin.resume();
    stdin.once('data', data => {
      resolve(data.toString().trim());
    });
  });
}

module.exports = async function run() {
  try {
    if (process.argv.length <= 2) {
      printHelp();
    } else if (['-f', '--file'].includes(process.argv[2])) {
      printAsciiArt();

      console.log(colors.cyan('[01]') + colors.green(' FOR COMPRESS C'));
      console.log(colors.cyan('[02]') + colors.green(' FOR NO COMPRESS C (IMGUI BETTER RESPONSE)'));

      const option = await promptInput(colors.magenta('>> Select Your Option: '));
      
      const fontFile = process.argv[3];
      const outputFile = process.argv[5];

      if (option === '1' || option === '01') {
        execSync(`font2c ${fontFile} PIRO`);   
        execSync(`font2c ${fontFile} PIRO > ${outputFile}`);    
        process.exit(1); 
      } else if (option === '2' || option === '02') {
        execSync(`font2c -nocompress ${fontFile} PIRO`);
        execSync(`font2c -nocompress ${fontFile} PIRO > ${outputFile}`);  
        process.exit(1); 
      } else {
        throw new Error('Invalid option');   
      }
    } else if (['-i', '--image'].includes(process.argv[2])) {
      let [imageFolder, outputFile] = loadConfig();
      
      if (imageFolder && outputFile) {
          const useSavedResponse = await promptInput(colors.magenta('>> Use saved paths? (y/n): '));
          
          const useSaved = useSavedResponse.toLowerCase();
           
          if (useSaved !== 'y') {
          imageFolder = await promptInput(colors.green('>> ENTER IMAGE FOLDER PATH: '));
          outputFile = await promptInput(colors.magenta('>> OUTPUT FILE PATH: '));
          
          saveConfig(imageFolder, outputFile); 
        }
      } else {
        imageFolder = await promptInput(colors.green('>> ENTER IMAGE FOLDER PATH: '));
        outputFile = await promptInput(colors.magenta('>> OUTPUT FILE PATH: '));
        
        saveConfig(imageFolder, outputFile);   
      }
      
      generateImageCppCode(imageFolder, outputFile);
      
      console.log(colors.green(`C++ code saved to ${outputFile}`)); 
      process.exit(1); 
    } else {
      throw new Error(colors.red('Invalid command. Use \'-h\' for help.'));   
    }
  } catch (err) {
    console.error(colors.red(`Error: ${err}`));
    console.log(colors.cyan(`
    Usage:  
      imfont -f <font.ttf> -o <output_name>
      imfont -i -f <image_folder> -o <output_file>
    
    Options:    
      -f, --file <font.ttf>        Input file for imfont tool
      -o, --output <output_name>   Output name for imfont tool
      -i, --image                  Use image to C++ array tool
      -h, --help                   Show this help message
  `));
  process.exit(1); 
  }  
};

