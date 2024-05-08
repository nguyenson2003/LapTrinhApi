import pyodbc
from Main import justExeSqlQuery
from SQLQuery import *
from config import con_str
conn = pyodbc.connect(con_str)
resQuery=justExeSqlQuery(SQLGETALLTESTFILE)
print(resQuery)