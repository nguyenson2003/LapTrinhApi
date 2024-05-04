import flask
import pyodbc
from SQLQuery import *
#tạo chuỗi kết nối
con_str = (
    "Driver={SQL Server};"
    "Server=DESKTOP-1CHI5GD\SQLEXPRESS;"
    "Database=btl_laptrinhapi;"
    #UID, PWD
    "Trusted_Connection=yes;"
)
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
        return flask.jsonify({"lỗi":e})
try:
    if __name__ == "__main__":
        from routes import all
        app.register_blueprint(all)
        app.run(host = '127.0.0.1', port=5000)
except:
    print("lỗi")