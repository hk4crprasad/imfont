# imfont Tool 🎨

Convert images to C++ arrays with ease! This tool helps you generate C++ code for embedding images in your projects.

## Installation

To install the `imfont` tool, you can use pip:

```bash
pip install imfont
```

## Usage

### CLI Usage

```bash
imfont -f <filename> -o <output_name>
imfont -i -f <image_folder> -o <output_file>
```

#### Options

- `-f, --file <filename>`: Input file for the imfont tool
- `-o, --output <output_name>`: Output name for the imfont tool
- `-i, --image`: Use image to C++ array tool
- `-h, --help`: Show help message

### Example

```bash
imfont -f /path/to/font.ttf -o output.h
```
<p align="center">
  
  [![PIROOP](https://raw.githubusercontent.com/hk4crprasad/imfont/master/IMFONT.svg)](https://github.com/hk4crprasad/imfont)
### Interactive Mode

Run the script without any arguments to enter interactive mode:

```bash
python main.py
```

Follow the prompts to select compression options and specify input/output paths.

## Credits

Made with ❤️ by [HK4CRPRASAD](https://github.com/HK4CRPRASAD)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
