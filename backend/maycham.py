import os
import subprocess
import time
import psutil
import pyodbc
from Main import justExeSqlQuery
from SQLQuery import *
from config import con_str
conn = pyodbc.connect(con_str)
resQuery=justExeSqlQuery(SQLGETALLTESTFILE)
print(resQuery)

rel_path = os.path.dirname(__file__)#đường dẫn tương đối
file_path_cpp = os.path.join(rel_path, 'cppcode.cpp')
file_path_exe = os.path.join(rel_path, 'code.exe')
#c++ ###################################################################################
def getInOut(ipb):
    infiles_path=justExeSqlQuery(SQLGETINPUTFILENAMEBYPBI,ipb)
    outfiles_path=justExeSqlQuery(SQLGETOUTPUTFILENAMEBYPBI,ipb)
    

def withCpp(idp,theAnswer):
    
    with open(file_path_cpp, "w") as file:
        file.write(theAnswer)
    subprocess.run(["g++", file_path_cpp, "-o", file_path_exe])#biên dịch
    id=0
    while(id<infiles_path)
    # trc khi chạy code
    start_time = time.time()
    memory_info = psutil.Process().memory_info().rss
    # chạy code
    try:
        result = subprocess.run([file_path_exe], input='', capture_output=True, text=True, timeout=5)
        output = result.stdout
        error = result.stderr
        if error:
            print("Lỗi:", error)
        else:
            print("Kết quả:", output)
    except subprocess.TimeoutExpired:
        print("Lỗi: Thời gian chạy vượt quá giới hạn")

