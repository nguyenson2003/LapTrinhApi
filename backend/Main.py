import threading
import flask
import pyodbc
import io
from SQLQuery import *
from maycham import cham
from config import con_str
#tạo chuỗi kết nối

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
try:
    if __name__ == "__main__":
        t1 = threading.Thread(target=cham)
        t1.start()
        from routes import all
        app.register_blueprint(all)
        app.run(host = '127.0.0.1', port=5000)
except Exception as e:
    print("lỗi ", e)