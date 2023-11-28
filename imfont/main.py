import os
import shutil
from imfont import point

def copy_and_chmod(src, dest):
    try:
        shutil.copy(src, dest)
        os.chmod(dest, 0o777)
        return True
    except Exception as e:
        print(f"\033[1;31mError: {e}.\033[0m")
        return False

def main():
    try:
        font2c_path = f"{prefix_path}/bin/font2c"
        if os.path.exists(font2c_path):
            point()
        else:
            if "termux" in os.environ.get("SHELL", "").lower():
                termux_path = f"{prefix_path}/lib/python3.11/site-packages/imfont/font2c"
                if copy_and_chmod(termux_path, font2c_path):
                    point()
                else:
                    print("\033[1;31mFailed to copy and chmod font2c for Termux.\033[0m")
            else:
                if copy_and_chmod("/usr/local/lib/python3.9/dist-packages/imfont/font2c", "/usr/bin/font2c"):
                    point()
                else:
                    print("\033[1;31mFailed to copy and chmod font2c for other Linux distributions.\033[0m")
    except Exception as e:
        print("\033[1;31mAn unexpected error occurred.\033[0m")

if __name__ == "__main__":
    main()
