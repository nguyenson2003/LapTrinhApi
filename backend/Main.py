import flask
import pyodbc
from SQLQuery import *
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
        resp.headers.add("Access-Control-Allow-Origin","*")
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
try:
    if __name__ == "__main__":
        from routes import all
        app.register_blueprint(all)
        app.run(host = '127.0.0.1', port=5000)
except:
    print("lỗi")