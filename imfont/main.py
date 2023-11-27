from imfont import point
import os, sys
prefix_path = sys.prefix
def main():
    try:
        if os.path.exists(f"{prefix_path}/bin/font2c"):
            point()
        else:
            os.system(f"cp {prefix_path}/lib/python3.11/site-packages/imfont/font2c {prefix_path}/bin/font2c")
            point()
    except Exception as e:
        print(f"\033[1;31mError: {e}.\033[0m")
        print("\033[1;31mAn unexpected error occurred.\033[0m")

if __name__ == "__main__":    
        main()
    