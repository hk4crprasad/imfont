import os
import shutil
from imfont import point
import sys

def copy_and_chmod(src, dest):
    try:
        shutil.copy(src, dest)
        os.chmod(dest, 0o777)
        return True
    except Exception as e:
        print(f"\033[1;31mError during copy_and_chmod: {e}.\033[0m")
        return False
prefix_path = sys.prefix
def main():
    try:
        font2c_path = f"{prefix_path}/bin/font2c"
        if os.path.exists(font2c_path):
            point()
        else:
            if os.path.exists("/data/data/com.termux/files/usr/bin"):
                # For Termux
                termux_path = f"{prefix_path}/lib/python3.11/site-packages/imfont/font2c"
                if copy_and_chmod(termux_path, font2c_path):
                    point()
                else:
                    print("\033[1;31mFailed to copy and chmod font2c for Termux.\033[0m")
            else:
                # For other Linux systems
                other_linux_path = "/usr/local/lib/python3.9/dist-packages/imfont/font2c"
                if copy_and_chmod(other_linux_path, "/usr/bin/font2c"):
                    point()
                else:
                    print("\033[1;31mFailed to copy and chmod font2c for other Linux systems.\033[0m")
    except Exception as main_error:
        print(f"\033[1;31mAn unexpected error occurred in main(): {main_error}.\033[0m")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
