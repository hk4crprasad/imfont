from imfont import point
import os, sys
prefix_path = sys.prefix
def main():
    try:
        if os.path.exists(f"{prefix_path}/bin/font2c"):
            point()
        else:
            try:
                os.system(f"cp {prefix_path}/lib/python3.*/site-packages/imfont/font2c {prefix_path}/bin/font2c")
                os.system(f"chmod 777 {prefix_path}/bin/font2c")
            except Exception as e:
                os.system(f"cp /usr/local/lib/python3.*/dist-packages/imfont/font2c /usr/bin/font2c")
                os.system(f"chmod 777 /usr/bin/font2c")
            point()
    except Exception as e:
        print(f"\033[1;31mError: {e}.\033[0m")
        print("\033[1;31mAn unexpected error occurred.\033[0m")

if __name__ == "__main__":    
        main()
    
