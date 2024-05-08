import io
import os
import subprocess
import time
import zipfile
import psutil
import pyodbc
from Main import justExeSqlQuery
from SQLQuery import *
from config import con_str
conn = pyodbc.connect(con_str)

rel_path = os.path.dirname(__file__)#đường dẫn tương đối
file_path_cpp = os.path.join(rel_path, 'cppcode.cpp')
file_path_exe = os.path.join(rel_path, 'code.exe')
numtes=0
#c++ ###################################################################################
def withCpp(idp,theAnswer):
    #đọc các dữ liệu cần thiết
    numtes=int(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["NumberTestcase"])
    timeLimit=float(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['TimeLimit'])
    menoLimit=int(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['MemoryLimit'])
    fileZip = io.BytesIO(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["FileZip"])
    with zipfile.ZipFile(fileZip, 'r') as zip_ref:
        file_list = zip_ref.namelist()
        for file_name in file_list:
            # print(file_name)
            # Đọc nội dung của từng tệp tin hoặc thư mục
            file_data = zip_ref.read(file_name)
            # Xử lý nội dung theo nhu cầu của bạn
            # Ví dụ: in ra nội dung của tệp tin
            print(file_data.decode())
    with open(file_path_cpp, "w") as file:
        file.write(theAnswer)
    subprocess.run(["g++", file_path_cpp, "-o", file_path_exe])#biên dịch
    
    for i in range(1,numtes+1):
        filein=open(os.path.join(rel_path, 'in'+str(i)+'.txt'), "r")
        fileout=open(os.path.join(rel_path, 'out'+str(i)+'.txt'), "r")
        # trc khi chạy code
        start_time = time.time()
        memory_info = psutil.Process().memory_info().rss
        # chạy code
        try:
            result = subprocess.run([file_path_exe], input=filein.read(), capture_output=True, text=True, timeout=timeLimit)
            output = result.stdout
            error = result.stderr
            if error:
                return {'mess':error}
            else:
                if output!=fileout.read():
                    return {'mess':"wa"}
            memory_info = (psutil.Process().memory_info().rss - memory_info)/1024
            if memory_info>menoLimit     
        except subprocess.TimeoutExpired:
            print("Lỗi: tle")
ans="""
#include<bits/stdc++.h>
using namespace std;

main(){
	int a;
    cin>>a;
    while(true){}
    cout<<a;
}
"""
withCpp('pb1',ans)