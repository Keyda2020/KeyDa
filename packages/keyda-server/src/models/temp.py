import sys


def return_number(val):
    if(val == 5):
        return 100
    else:
        return 10


if __name__ == "__main__":
    return_number(5)
    path = sys.argv[0]
    if type(path) is str:
        print(87.2128)
    else:
        print(45.1952)
