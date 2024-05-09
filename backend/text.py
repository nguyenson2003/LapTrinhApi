import datetime

# Lấy thời gian hiện tại

# Chuyển đổi đối tượng datetime thành chuỗi định dạng "hh:mm:ss - dd/MM/yy"
formatted_time = datetime.datetime.now().strftime("%d-%m-%y %H:%M:%S")

# In kết quả
print(formatted_time)