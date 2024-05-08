import pyodbc
con_str = (
    "Driver={SQL Server};"
    "Server=DESKTOP-1CHI5GD\SQLEXPRESS;"
    "Database=btl_laptrinhapi;"
    #UID, PWD
    "Trusted_Connection=yes;"
)
# Kết nối đến cơ sở dữ liệu SQLite
conn = pyodbc.connect(con_str)
cursor = conn.cursor()

# Đường dẫn đến file cần chèn
file_path = "D:\\Documents\\GitHub\\LapTrinhApi\\backend\\cppcode.cpp"

# Đọc nội dung file
with open(file_path, "rb") as file:
    file_data = file.read()

print(file_data)
# Chèn file vào cơ sở dữ liệu
cursor.execute("insert into tblTestCaseFile values(?,?)", ('pb1',file_data))
# Lưu thay đổi và đóng kết nối
conn.commit()
conn.close()