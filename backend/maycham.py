import io
import os
import re
import subprocess
import time
import zipfile
import psutil
import pyodbc
from Main import execuleSqlEdit, justExeSqlQuery
from SQLQuery import *
from SQLEdit import SQLUPDATESUB
from config import con_str
conn = pyodbc.connect(con_str)

rel_path = os.path.dirname(__file__)#đường dẫn tương đối
file_path_cpp = os.path.join(rel_path, 'cppcode.cpp')
file_path_python=os.path.join(rel_path, 'pythoncode.py')
file_path_exe = os.path.join(rel_path, 'code.exe')
file_path_class=os.path.join(rel_path, 'javacode.class')
file_path_java=os.path.join(rel_path, 'javacode.java')

#c++ ###################################################################################
def check_java_package(str):
    return re.search(r'^\s*package\s+[\w.]+\s*;', str, re.MULTILINE)
def replace_class_name(java_code, new_class_name):
    pattern = r'public\s+class\s+(\w+)'
    modified_code = re.sub(pattern, f'public class {new_class_name}', java_code)
    return modified_code
def find_public_class(java_code):
    match = re.search(r'public\s+class\s+(\w+)', java_code)
    if match:
        return match.group(1)
    else:
        return None
def cham():
    #ngủ 3s
    time.sleep(3)
    #tìm xem bài nào chưa được chấm
    idsmt=13
    #đọc các dữ liệu cần thiết
    numtes=0
    state=[]
    resSql=justExeSqlQuery(SQLGETSOMEVALUEFORMAYCHAM,idsmt)[0]
    idp=resSql["ProblemId"]
    
    language=resSql["LanguageName"]
    # language='java'
    theAnswer=resSql["TheAnswer"]
    theAnswer="""print(input())
    """
    # timeLimit=1
    timeLimit=float(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['TimeLimit'])
    menoLimit=int(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['MemoryLimit'])
    menoLimit=100
    
    numtes=int(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["NumberTestcase"])
    fileZip = io.BytesIO(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["FileZip"])
    zip_ref=zipfile.ZipFile(fileZip, 'r')
    execution_time=0
    memory_info=0
    #viết đáp án vào file tương ứng
    if language=='cpp':
        with open(file_path_cpp, "w") as file:
            file.write(theAnswer)
        try:
            subprocess.run(["g++", file_path_cpp, "-o", file_path_exe])#biên dịch
        except Exception as e:
            state.append({'status':"CE"})
            return state
    elif language=='python':
        with open(file_path_python, "w") as file:
            file.write(theAnswer)
    elif language=='java':   
        if check_java_package(theAnswer):
            state.append({'status':"CE",'e':"theAnswer chứa dòng package"})
            return state
        if find_public_class(theAnswer)==None:
            state.append({'status':"CE",'e':"theAnswer không có public class <name>"})
            return state
        theAnswer=replace_class_name(theAnswer,'javacode')
        
        theAnswer='package backend;\n'+theAnswer  
        with open(file_path_java, "w") as file:
            file.write(theAnswer)    
        
        #TODO: biên dịch
        #biên dịch ở đây
        try:
            # subprocess.run(['javac',file_path_java],capture_output=True, text=True,timeout=5)
            True
        except Exception as e:
            state.append({'status':"CE",'e':e})
            return state    
            
    for i in range(1,numtes+1):
        #lấy dữ liệu từng file
        filein_data=zip_ref.read('in'+str(i)+'.txt').decode()
        fileout_data=zip_ref.read('in'+str(i)+'.txt').decode()
        # chạy code
        result=0
        execution_time = time.time()
        memory_info = psutil.Process().memory_info().rss
        try:
            if language=='cpp':
                result = subprocess.run([file_path_exe], input=filein_data, capture_output=True, text=True, timeout=timeLimit)
            elif language=='python':
                result = subprocess.run(['python',file_path_python],input=filein_data,capture_output=True, text=True, timeout=timeLimit)
            elif language=='java':
                result = subprocess.run(['javac',file_path_java],input=filein_data, capture_output=True, text=True,timeout=timeLimit)
            execution_time=time.time()-execution_time
            memory_info =(psutil.Process().memory_info().rss-memory_info)/1024
        except subprocess.TimeoutExpired:
            state.append({'test number':i,'status':"TLE","timeLimit":timeLimit}) 
            continue  
        if memory_info>menoLimit :
            state.append({'test number':i,'status':"MLE","memory_info":memory_info,"menoLimit":menoLimit})
            continue    
        error = result.stderr
        if error:
            state.append({'test number':i,'status':'RTE','e':"a"})
            continue 
        output = result.stdout
        if output!=fileout_data:
            state.append({'test number':i,'status':"WA",'output':output,"fileout_data":fileout_data})
            continue 
        state.append({'test number':i,'status':"AC","memory_info":memory_info,"execution_time":execution_time})
    print(state)
    
#giả sử cần chấm 1 sub có sub id=1
cham()
