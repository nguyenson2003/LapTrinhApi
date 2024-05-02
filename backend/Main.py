import flask
import pyodbc
from SQLQuery import *
#tạo chuỗi kết nối
con_str = (
    "Driver={SQL Server};"
    "Server=ADMIN-PC\\NQSON;"
    "Database=btl_laptrinhapi;"
    #UID, PWD
    "Trusted_Connection=yes;"
)
try:
    # kết nối
    conn = pyodbc.connect(con_str)
    print("Kết nối Thành công")
    #khởi tạo app
    app = flask.Flask(__name__)
    # GET: select, POST: insert, PUT: cập nhật dữ liệu, DELETE: xóa dữ liệu
    @app.route('/problem/getall', methods=['GET'])
    def getAllProblem():
        try:
            cursor = conn.cursor()
            sql = SQLPROBLEMGETALL
            cursor.execute(sql)
            results = [] # kết quả
            keys = []
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
    # get problem by type
    @app.route('/2', methods = ['GET'])
    def getProblemByType():
        # try:
        #     cursor = conn.cursor()
        #     sql = SQLPROBLEMGETALL
        #     cursor.execute(sql)
        #     results = [] # kết quả
        #     keys = []
        #     for i in cursor.description: # lấy các key
        #         keys.append(i[0])
        #     for i in cursor.fetchall(): # lấy tất cả bản ghi
        #         results.append(dict(zip(keys, i)))
        #     resp = flask.jsonify(results)
        #     resp.status_code = 200
        #     return resp
        # except Exception as e:
        #     return flask.jsonify({"lỗi":e})
        try:
            cursor = conn.cursor() 
            sql = SQLPROBLEMGETALL
            # data = idtype
            cursor.execute(sql)
            results = []
            keys = []
            for i in cursor.description: # lấy các key
                keys.append(i[0])
            for i in cursor.fetchall(): # lấy kết quả
                results.append(dict(zip(keys, i)))
            resp = flask.jsonify(results)
            resp.status_code = 200
            return resp
        except Exception as e:
            return flask.jsonify({"lỗi":e})
    # get problem by type
    @app.route('/1', methods = ['GET'])
    def getProblemByName(name="hello"):
        try:
            sql = SQLGETPROBLEMBYNAME
            cursor = conn.cursor()
            data = name
            cursor.execute(sql)
            result = {}
            keys = []
            for i in cursor.description: # lấy các key
                keys.append(i[0])
            for i in cursor.fetchall(): # lấy kết quả
                result = (dict(zip(keys, i)))
            resp = flask.jsonify(result)
            resp.status_code = 200
            return resp
        except Exception as e:
            return flask.jsonify({"lỗi":e})
    if __name__ == "__main__":
        app.run(host = '127.0.0.1', port=5000)
except:
    print("lỗi")