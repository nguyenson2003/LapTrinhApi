import threading
import flask
import pyodbc
import io
from SQLQuery import *
from SQLEdit import SQLUPDATESUB
from config import con_str

import os
import re
import subprocess
import time
import zipfile
import psutil
#tạo chuỗi kết nối

rel_path = os.path.dirname(__file__)#đường dẫn tương đối
file_path_cpp = os.path.join(rel_path, 'cppcode.cpp')
file_path_python=os.path.join(rel_path, 'pythoncode.py')
file_path_exe = os.path.join(rel_path, 'code.exe')
file_path_class=os.path.join(rel_path, 'javacode.class')
file_path_java=os.path.join(rel_path, 'javacode.java')

conn = pyodbc.connect(con_str)

app = flask.Flask(__name__)
def executeSqlQuery(sqlQuery,*args):
    try:
        cursor = conn.cursor()
        cursor.execute(sqlQuery,args)
        results ,keys = [],[]
        for i in cursor.description: # lấy các key
            keys.append(i[0])
        for i in cursor.fetchall(): # lấy tất cả bản ghi
            results.append(dict(zip(keys, i)))
        resp = flask.jsonify(results)
        resp.status_code = 200
        return resp
    except Exception as e:
        print("lỗi ",e)
def justExeSqlQuery(sql,*args):
    try:
        cursor = conn.cursor()
        cursor.execute(sql,args)
        results ,keys = [],[]
        for i in cursor.description: # lấy các key
            keys.append(i[0])
        for i in cursor.fetchall(): # lấy tất cả bản ghi
            results.append(dict(zip(keys, i)))
        
        return results
    except Exception as e:
        print("lỗi ",e)
    
def execuleSqlEdit(sqlEdit,*args):
    try:
        cursor = conn.cursor()
        cursor.execute(sqlEdit,args)
        conn.commit()
        return flask.jsonify({"mess":"success"})
    except Exception as e:
        return flask.jsonify({"mess":e})
def executeGetFileZip(problemId):
    try:
        cursor = conn.cursor()
        cursor.execute('select filezip from tblTestCaseFile where problemid = ?',problemId)
        f = io.BytesIO()
        f.write(cursor.fetchall()[0][0])
        f.seek(0)
        return flask.send_file(f,download_name='test.zip',mimetype='zip',as_attachment=True)
    except Exception as e:
        print("lỗi ",e)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response


def cham():
    #ngủ 3s
    time.sleep(3)
    #tìm xem bài nào chưa được chấm
    try:
        idsmt=justExeSqlQuery("select * from tblSubmissions where Point='-1'")
        if len(idsmt)==0:
            print("hết bài")
            cham()
        idsmt=idsmt[0]["SubmissionId"]
        #đọc các dữ liệu cần thiết
        numtes=0
        state=[]
        resSql=justExeSqlQuery(SQLGETSOMEVALUEFORMAYCHAM,idsmt)[0]
        idp=resSql["ProblemId"]
        
        language=resSql["LanguageName"]
        # language='java'
        theAnswer=resSql["TheAnswer"]
        # theAnswer="""
        #     import java.util.Scanner;

        #     public class a {
        #         public static void main(String[] args) {
        #             try (Scanner scanner = new Scanner(System.in)) {
        #                 int x = scanner.nextInt();
        #                 System.out.println(x);
        #             }
        #         }
        #     }
        # """
        # timeLimit=1
        
        timeLimit=float(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['TimeLimit'])
        # menoLimit=100
        menoLimit=int(justExeSqlQuery(SQLGETTIMELIMBYIDP,idp)[0]['MemoryLimit'])
        
        numtes=int(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["NumberTestcase"])
        fileZip = io.BytesIO(justExeSqlQuery(SQLGETNUMTESBYID,idp)[0]["FileZip"])
        zip_ref=zipfile.ZipFile(fileZip, 'r')
        execution_time=0
        memory_info=0
    except Exception as e:
        print(e)
        cham()
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
    
    
    cntTestAC=0
    #các dữ liệu cần insert
    Point=TotalTime=Memory=''
    SubStatus="AC"
    
    for x in state:
        if x['status']=='AC':
            cntTestAC+=1
            TotalTime+=x['execution_time']
            Memory+=x['memory_info']
        else:
            if(SubStatus!='AC'):
                SubStatus=x['status']
    Point=int(cntTestAC*1.0/numtes)
    execuleSqlEdit(SQLUPDATESUB,Memory,TotalTime,SubStatus,Point,idsmt)
    print("thành công")
    cham()

try:
    if __name__ == "__main__":
        t1 = threading.Thread(target=cham)
        t1.start()
        from routes import all
        app.register_blueprint(all)
        app.run(host = '127.0.0.1', port=5000)
except Exception as e:
    print("lỗi ", e)
    
    
    








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

#giả sử cần chấm 1 sub có sub id=1
