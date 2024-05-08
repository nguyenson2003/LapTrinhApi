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
file_path_python=os.path.join(rel_path, 'pythoncode.py')
file_path_exe = os.path.join(rel_path, 'code.exe')
numtes=0
#c++ ###################################################################################
def cham(idsmt):
    #đọc các dữ liệu cần thiết
    state=[]
    resSql=justExeSqlQuery(SQLGETSOMEVALUEFORMAYCHAM,idsmt)[0]
    idp=resSql["ProblemId"]
    # language=resSql["LanguageName"]
    language='python'
    # theAnswer=resSql["TheAnswer"]
    theAnswer="""
        #include<bits/stdc++.h>
        using namespace std;

        main(){
            int a;
            cin>>a;
            cout<<a<<' ';
        }
        """
    numtes=int(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["NumberTestcase"])
    timeLimit=float(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['TimeLimit'])
    menoLimit=int(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['MemoryLimit'])
    fileZip = io.BytesIO(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["FileZip"])
    zip_ref=zipfile.ZipFile(fileZip, 'r')
    
    if language=='cpp':
        with open(file_path_cpp, "w") as file:
            file.write(theAnswer)
        try:
            subprocess.run(["g++", file_path_cpp, "-o", file_path_exe])#biên dịch
        except Exception as e:
            state.append({'mess':"CE"})
        for i in range(1,numtes+1):
            #lấy dữ liệu từng file
            filein_data=zip_ref.read('in'+str(i)+'.txt').decode()
            fileout_data=zip_ref.read('in'+str(i)+'.txt').decode()
            # chạy code
            memory_infob = psutil.Process().memory_info().rss
            try:
                result = subprocess.run([file_path_exe], input=filein_data, capture_output=True, text=True, timeout=timeLimit)
            except subprocess.TimeoutExpired:
                state.append({'test number':i,'mess':"TLE","timeLimit":timeLimit}) 
                continue  
            memory_infoa =psutil.Process().memory_info().rss
            memory_info=(memory_infoa- memory_infob)/1024
            if memory_info>menoLimit :
                state.append({'test number':i,'mess':"MLE",'memory_infob':memory_infob,
                            "memory_infoa":memory_infoa,"memory_info":memory_info,"menoLimit":menoLimit})
                continue    
            error = result.stderr
            if error:
                state.append({'test number':i,'mess':'RTE','e':error})
                continue 
            output = result.stdout
            if output!=fileout_data:
                state.append({'test number':i,'mess':"WA",'output':output,"fileout_data":fileout_data})
                continue 
            state.append({'test number':i,'mess':"AC"})
        
    if language=='java':
        a=1
    if language=='python':
        for i in range(1,numtes+1):
            #lấy dữ liệu từng file
            filein_data=zip_ref.read('in'+str(i)+'.txt').decode()
            fileout_data=zip_ref.read('in'+str(i)+'.txt').decode()
            # chạy code
            memory_infob = psutil.Process().memory_info().rss
            try:
                result = subprocess.run([file_path_python],input=filein_data,capture_output=True, text=True, timeout=timeLimit)
            except subprocess.TimeoutExpired:
                state.append({'test number':i,'mess':"TLE","timeLimit":timeLimit}) 
                continue  
            memory_infoa =psutil.Process().memory_info().rss
            memory_info=(memory_infoa- memory_infob)/1024
            if memory_info>menoLimit :
                state.append({'test number':i,'mess':"MLE",'memory_infob':memory_infob,
                            "memory_infoa":memory_infoa,"memory_info":memory_info,"menoLimit":menoLimit})
                continue    
            error = result.stderr
            if error:
                state.append({'test number':i,'mess':'RTE','e':error})
                continue 
            output = result.stdout
            if output!=fileout_data:
                state.append({'test number':i,'mess':"WA",'output':output,"fileout_data":fileout_data})
                continue 
            state.append({'test number':i,'mess':"AC"})
    print(state)
        
ans="""
#include<bits/stdc++.h>
using namespace std;

main(){
	int a;
    cin>>a;
    cout<<a<<' ';
}
"""
cham(1)