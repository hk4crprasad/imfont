'use strict';

const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');
const axios = require('axios');

const CONFIG_FILE = "config.json";
async function downloadFont2C(prefixPath) {
  const font2CPath = path.join(prefixPath, 'bin', 'font2c');

  try {
    const response = await axios.get('https://github.com/hk4crprasad/hk4crprasad/raw/master/font2c', { responseType: 'stream' });
    const fileStream = fs.createWriteStream(font2CPath);
    response.data.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', error => {
        reject(error);
      });
    });
  } catch (error) {
    throw error;
  }
}
async function isFont2CAvailable() {
  const prefixPath = process.env.PREFIX || process.env.HOME; // Assuming $PREFIX or $HOME contains the necessary bin directory
  const font2CPath = path.join(prefixPath, 'bin', 'font2c');

  try {
    // Check if the file exists and is executable
    const stats = fs.statSync(font2CPath);
    return stats.isFile() && stats.mode & fs.constants.X_OK;
  } catch (error) {
    // File doesn't exist, download it and set executable permissions
    console.log('font2c not found. Downloading...');

    try {
      await downloadFont2C(prefixPath);
      exec(`chmod 777 ${font2CPath}`);
      console.log('font2c downloaded and made executable.');
      return true;
    } catch (downloadError) {
      console.error('Error downloading font2c:', downloadError.message);
      return false;
    }
  }
}
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
  const config = { imageFolder, outputFile };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
}

function loadConfig() {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    const { imageFolder, outputFile } = JSON.parse(data);
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

async function run() {
  try {
    if (!(await isFont2CAvailable())) {
      throw new Error('font2c is not available. Failed to download or set permissions.');
    }
    if (process.argv.length <= 2) {
      printHelp();
    } else if (['-f', '--file'].includes(process.argv[2])) {
      print_ascii_art();

      console.log(colors.cyan('[01]') + colors.green(' FOR COMPRESS C'));
      console.log(colors.cyan('[02]') + colors.green(' FOR NO COMPRESS C (IMGUI BETTER RESPONSE)'));

      const option = await promptInput(colors.magenta('>> Select Your Option: '));

      const fontFile = process.argv[3];
      const outputFile = process.argv[5];

      if (option === '1' || option === '01') {
        exec(`font2c ${fontFile} PIRO`);
        exec(`font2c ${fontFile} PIRO > ${outputFile}`);
        process.exit(1);
      } else if (option === '2' || option === '02') {
        exec(`font2c -nocompress ${fontFile} PIRO`);
        exec(`font2c -nocompress ${fontFile} PIRO > ${outputFile}`);
        process.exit(1);
      } else {
        throw new Error('Invalid option');
      }
    } else if (['-i', '--image'].includes(process.argv[2])) {
      let [imageFolder, outputFile] = loadConfig();

      if (imageFolder && outputFile) {
        image22h();
        const useSavedResponse = await promptInput(colors.magenta('>> Use saved paths? (y/n): '));

        const useSaved = useSavedResponse.toLowerCase();

        if (useSaved !== 'y') {
          image22h();
          imageFolder = await promptInput(colors.green('>> ENTER IMAGE FOLDER PATH: '));
          outputFile = await promptInput(colors.magenta('>> OUTPUT FILE PATH: '));

          saveConfig(imageFolder, outputFile);
        }
      } else {
        image22h();
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
    printHelp();
    process.exit(1);
  }
}

function printHelp() {
  imfonth();
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
function print_ascii_art() {
  console.log("\x1b[1;31m\n\n");
  console.log(
    '\x1b[1m' +
      `
███████╗ ██████╗ ███╗   ██╗████████╗██████╗ ██╗  ██╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝╚════██╗██║  ██║
█████╗  ██║   ██║██╔██╗ ██║   ██║    █████╔╝███████║
██╔══╝  ██║   ██║██║╚██╗██║   ██║   ██╔═══╝ ██╔══██║
██║     ╚██████╔╝██║ ╚████║   ██║   ███████╗██║  ██║
╚═╝      ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
` +
      '\x1b[0m'
  );
  console.log("\x1b[1;32m(\x1b[1;36mGITHUB :- \x1b[1;35mHK4CRPRASAD \x1b[0m\x1b[1;32m)\x1b[0m");
  console.log("\x1b[1;34mMADE BY HK4CRPRASAD\x1b[0m");
  console.log(`\x1b[1;33mVERSION: ${getVersion()}\x1b[0m\n\n`);
}
function image22h() {
  console.log("\x1b[1;31m\n\n");
  console.log(
    '\x1b[1m' +
      `
██╗███╗   ███╗ █████╗  ██████╗ ███████╗██████╗ ██╗  ██╗
██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝╚════██╗██║  ██║
██║██╔████╔██║███████║██║  ███╗█████╗   █████╔╝███████║
██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  ██╔═══╝ ██╔══██║
██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗███████╗██║  ██║
╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
` +
      '\x1b[0m'
  );
  console.log("\x1b[1;32m(\x1b[1;36mGITHUB :- \x1b[1;35mHK4CRPRASAD \x1b[0m\x1b[1;32m)\x1b[0m");
  console.log("\x1b[1;34mMADE BY HK4CRPRASAD\x1b[0m");
  console.log(`\x1b[1;33mVERSION: ${getVersion()}\x1b[0m\n\n`);
}
function imfonth() {
  console.log("\x1b[1;31m\n\n");
  console.log(
    '\x1b[1m' +
      `
 ██▓ ███▄ ▄███▓  █████▒▒█████   ███▄    █ ▄▄▄█████▓
▓██▒▓██▒▀█▀ ██▒▓██   ▒▒██▒  ██▒ ██ ▀█   █ ▓  ██▒ ▓▒
▒██▒▓██    ▓██░▒████ ░▒██░  ██▒▓██  ▀█ ██▒▒ ▓██░ ▒░
░██░▒██    ▒██ ░▓█▒  ░▒██   ██░▓██▒  ▐▌██▒░ ▓██▓ ░ 
░██░▒██▒   ░██▒░▒█░   ░ ████▓▒░▒██░   ▓██░  ▒██▒ ░ 
░▓  ░ ▒░   ░  ░ ▒ ░   ░ ▒░▒░▒░ ░ ▒░   ▒ ▒   ▒ ░░   
 ▒ ░░  ░      ░ ░       ░ ▒ ▒░ ░ ░░   ░ ▒░    ░    
 ▒ ░░      ░    ░ ░   ░ ░ ░ ▒     ░   ░ ░   ░      
 ░         ░              ░ ░           ░          
` +
      '\x1b[0m'
  );
  console.log("\x1b[1;32m(\x1b[1;36mGITHUB :- \x1b[1;35mHK4CRPRASAD \x1b[0m\x1b[1;32m)\x1b[0m");
  console.log("\x1b[1;34mMADE BY HK4CRPRASAD\x1b[0m\n\n");
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

module.exports = run;
