import subprocess
import time
import os
import json
import sys
from rich.progress import Progress
from rich.table import Table
from rich.traceback import install
from rich.syntax import Syntax
from rich.theme import Theme
from rich import pretty
from rich.markdown import Markdown
import requests
import pkg_resources
from rich.console import Console

console = Console()

def read_resource(path):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, path)
    try:
        with open(file_path, 'rb') as file:
            data = file.read()
            return data.decode() if data else ""
    except FileNotFoundError:
        console.print(f"[red]File not found:[/red] {file_path}")
        return ""

def read_version():
    return read_resource(".version").strip()

def get_remote_version():
    url = "https://raw.githubusercontent.com/hk4crprasad/imfont/pypi/imfont/.version"

    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text.strip()

    except requests.exceptions.RequestException as e:
        console.print(f"[red]Error fetching remote version:[/red] {e}")
        return None

def install_package():
    with Progress() as progress:
        task = progress.add_task("[cyan]Upgrading imfont...", total=100)

        for _ in range(100):
            progress.update(task, advance=1)
        
        subprocess.run(["pip", "install", "--upgrade", "--quiet", "imfont"], check=True)

# Main script
local_version = read_version()
remote_version = get_remote_version()

if remote_version and local_version and pkg_resources.parse_version(remote_version) > pkg_resources.parse_version(local_version):
    console.print(f"[green]Upgrading imfont from {local_version} to {remote_version}...[/green]")

    try:
        install_package()
        console.print("[bold green]Upgrade successful![/bold green]")
        console.print("[bold green]Restart again![/bold green]")
        sys.exit()
    except subprocess.CalledProcessError as e:
        console.print(f"[red]Error during upgrade:[/red] {e}")
else:
    console.print("[cyan]Local version is up to date.[/cyan]")

install(show_locals=True)
CONFIG_FILE = "config.json"
VERSION = read_version()

def save_config(image_folder, output_file):
    config = {"image_folder": image_folder, "output_file": output_file}
    with open(CONFIG_FILE, 'w') as config_file:
        json.dump(config, config_file)

def load_config():
    try:
        with open(CONFIG_FILE, 'r') as config_file:
            config = json.load(config_file)
            return config["image_folder"], config["output_file"]
    except FileNotFoundError:
        return None, None

def spinner(pid):
    spin = '\|/-'
    i = 0
    while subprocess.run(["kill", "-0", str(pid)], stdout=subprocess.PIPE, stderr=subprocess.PIPE).returncode == 0:
        i = (i + 1) % 4
        print(f"\r\033[1;36m[{spin[i]}]\033[0m \033[1;36m\033[32m Working\033[0m", end="")
        time.sleep(0.1)

    print("\r\n\033[1;32m[✔]\033[0m \033[1;32m Done\033[0m")
    subprocess.run(["tput", "cnorm"])

def imfonth():
    print("\033[1;31m\n\n")
    print(r"""
 ██▓ ███▄ ▄███▓  █████▒▒█████   ███▄    █ ▄▄▄█████▓
▓██▒▓██▒▀█▀ ██▒▓██   ▒▒██▒  ██▒ ██ ▀█   █ ▓  ██▒ ▓▒
▒██▒▓██    ▓██░▒████ ░▒██░  ██▒▓██  ▀█ ██▒▒ ▓██░ ▒░
░██░▒██    ▒██ ░▓█▒  ░▒██   ██░▓██▒  ▐▌██▒░ ▓██▓ ░ 
░██░▒██▒   ░██▒░▒█░   ░ ████▓▒░▒██░   ▓██░  ▒██▒ ░ 
░▓  ░ ▒░   ░  ░ ▒ ░   ░ ▒░▒░▒░ ░ ▒░   ▒ ▒   ▒ ░░   
 ▒ ░░  ░      ░ ░       ░ ▒ ▒░ ░ ░░   ░ ▒░    ░    
 ▒ ░░      ░    ░ ░   ░ ░ ░ ▒     ░   ░ ░   ░      
 ░         ░              ░ ░           ░          
""")
    print("\033[1;32m(\033[1;36mGITHUB :- \033[1;35mHK4CRPRASAD \033[0m\033[1;32m)\033[0m")
    print("\033[1;34mMADE BY HK4CRPRASAD\033[0m\n\n")
    
def image22h():
    print("\033[1;31m\n\n")
    print(r"""
██╗███╗   ███╗ █████╗  ██████╗ ███████╗██████╗ ██╗  ██╗
██║████╗ ████║██╔══██╗██╔════╝ ██╔════╝╚════██╗██║  ██║
██║██╔████╔██║███████║██║  ███╗█████╗   █████╔╝███████║
██║██║╚██╔╝██║██╔══██║██║   ██║██╔══╝  ██╔═══╝ ██╔══██║
██║██║ ╚═╝ ██║██║  ██║╚██████╔╝███████╗███████╗██║  ██║
╚═╝╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝
""")
    print("\033[1;32m(\033[1;36mGITHUB :- \033[1;35mHK4CRPRASAD \033[0m\033[1;32m)\033[0m")
    print("\033[1;34mMADE BY HK4CRPRASAD\033[0m")
    print(f"\033[1;33mVERSION: {VERSION}\033[0m\n\n")

def print_ascii_art():
    print("\033[1;31m\n\n")
    print(r"""
███████╗ ██████╗ ███╗   ██╗████████╗██████╗ ██╗  ██╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝╚════██╗██║  ██║
█████╗  ██║   ██║██╔██╗ ██║   ██║    █████╔╝███████║
██╔══╝  ██║   ██║██║╚██╗██║   ██║   ██╔═══╝ ██╔══██║
██║     ╚██████╔╝██║ ╚████║   ██║   ███████╗██║  ██║
╚═╝      ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
""")
    print("\033[1;32m(\033[1;36mGITHUB :- \033[1;35mHK4CRPRASAD \033[0m\033[1;32m)\033[0m")
    print("\033[1;34mMADE BY HK4CRPRASAD\033[0m")
    print(f"\033[1;33mVERSION: {VERSION}\033[0m\n\n")

def print_help():
    print(f"\033[1;33mVERSION: {VERSION}\033[0m")
    print("\n\033[1;36mUsage:\033[0m")
    print("\033[1;36m  imfont -f <font.ttf> -o <output_name>\033[0m")
    print("\033[1;36m  imfont -i -f <image_folder> -o <output_file>\033[0m")
    print("\n\033[1;36mOptions:\033[0m")
    print("\033[1;36m  -f, --file <font.ttf>\033[0m        Input file for imfont tool")
    print("\033[1;36m  -o, --output <output_name>\033[0m     Output name for imfont tool")
    print("\033[1;36m  -i, --image\033[0m                  Use image to C++ array tool")
    print("\033[1;36m  -h, --help\033[0m                   Show this help message")

def image_to_cpp_array(image_path, output_variable_name):
    with open(image_path, 'rb') as image_file:
        image_data = image_file.read()
    
    cpp_array = ', '.join(hex(byte) for byte in image_data)

    cpp_code = f"unsigned char {output_variable_name}[] = {{\n    {cpp_array}\n}};\n"
    cpp_code += f"size_t {output_variable_name}Size = sizeof({output_variable_name});\n"

    return cpp_code

def process_images_in_folder(folder_path):
    cpp_code = ""

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.png')):
            image_path = os.path.join(folder_path, filename)
            variable_name = os.path.splitext(filename)[0] + "1"
            cpp_code += image_to_cpp_array(image_path, variable_name)

    return cpp_code

def generate_image_cpp_code(image_folder, output_file):
    cpp_code = process_images_in_folder(image_folder)

    with open(output_file, 'w') as cpp_file:
        cpp_file.write(cpp_code)

    print(f"C++ code saved to {output_file}")

def point():
    if len(sys.argv) == 1 or sys.argv[1] == '-h' or sys.argv[1] == '--help':
        imfonth()
        print_help()
    elif len(sys.argv) > 2 and (sys.argv[1] == '-f' or sys.argv[1] == '--file'):
        n = sys.argv[2]
        p = sys.argv[4]
        print_ascii_art()
        print("\033[1;36m[\033[1;33m01\033[1;36m]\033[1;32m FOR COMPRESS C")
        print("\033[1;36m[\033[1;33m02\033[1;36m]\033[1;32m FOR NO COMPRESS C (IMGUI BETTER RESPONSE)")
        print("\n")
        h = input("\033[1;35m>> 𝑺𝒆𝒍𝒆𝒄𝒕 𝒀𝒐𝒖𝒓 𝑶𝒑𝒕𝒊𝒐𝒏:\033[0m ")

        print("\n\n\n")
        start_time = int(time.time())
        pid = subprocess.Popen(["font2c", n, "PIRO"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        if h == "1" or h == "01":
            spinner(pid)
            print("\n")
            with Progress() as progress:
                task = progress.add_task("[cyan]Processing...", total=100)
                for i in range(100):
                    progress.update(task, advance=1)
                    time.sleep(0.05)
                progress.stop()
            with open(p, "w") as outfile:
                subprocess.run(["font2c", n, "PIRO"], stdout=outfile)

        elif h == "2" or h == "02":
            spinner(pid)
            print("\n")
            with Progress() as progress:
                task = progress.add_task("[cyan]Processing...", total=100)
                for i in range(100):
                    progress.update(task, advance=1)
                    time.sleep(0.05)
                progress.stop()
            with open(p, "w") as outfile:
                subprocess.run(["font2c", "-nocompress", n, "PIRO"], stdout=outfile)
    elif len(sys.argv) > 2 and (sys.argv[1] == '-i' or sys.argv[1] == '--image'):
        saved_image_folder, saved_output_file = load_config()

        if saved_image_folder and saved_output_file:
            image22h()
            print("\n\n")
            use_saved_paths = input(f"\033[1;35m>> Use saved paths? (y/n):\033[0m ").lower()
            if use_saved_paths == 'y':
                image_folder = saved_image_folder
                output_file = saved_output_file
            else:
                image22h()
                image_folder = input("\033[1;32m>> ENTER IMAGE FOLDER PATH:\033[0m ")
                output_file = input("\033[1;35m>> OUTPUT FILE PATH:\033[0m ")
                save_config(image_folder, output_file)
        else:
            image22h()
            image_folder = input("\033[1;32m>> ENTER IMAGE FOLDER PATH:\033[0m ")
            output_file = input("\033[1;35m>> OUTPUT FILE PATH:\033[0m ")
            save_config(image_folder, output_file)

        print("\n")
        try:
            generate_image_cpp_code(image_folder, output_file)
        except NotADirectoryError as e:
            print(f"\033[1;31mError: {e}.\033[0m")
            print("\033[1;31mFolder not found.\033[0m")
            sys.exit()
        except FileNotFoundError as e:
            print(f"\033[1;31mError: {e}.\033[0m")
            print("\033[1;31mFolder not found.\033[0m")
            sys.exit()
        except OSError as e:
            print(f"\033[1;31mError: {e}.\033[0m")
            print("\033[1;31mUser not rooted not able to print here.\033[0m")
            sys.exit()
        with Progress() as progress:
            task = progress.add_task("[cyan]Processing...", total=100)
            for i in range(100):
                progress.update(task, advance=1)
                time.sleep(0.05)
            progress.stop()
    else:
        print("\033[1;31mInvalid command. Use '-h' for help.\033[0m")
