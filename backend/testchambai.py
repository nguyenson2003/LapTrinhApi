import subprocess
import os
import time

import psutil
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'cppcode.cpp')
fileexe=os.path.join(dirname, 'cppcode.exe')
# Lấy đường dẫn thư mục hiện tại

# Kompil file C++
subprocess.run(["g++", filename, "-o",
                fileexe])

# Chạy file C++ và lấy kết quả đầu ra
start_time = time.time()
memory_info = psutil.Process().memory_info().rss
# result=subprocess.run([fileexe], 
#                         input='1', capture_output=True, text=True)
try:
    result = subprocess.run([fileexe], input='', capture_output=True, text=True, timeout=5)
    output = result.stdout
    error = result.stderr
    if error:
        print("Lỗi:", error)
    else:
        print("Kết quả:", output)
except subprocess.TimeoutExpired:
    print("Lỗi: Thời gian chạy vượt quá giới hạn")

end_time = time.time()

# Tính thời gian chạy
execution_time = end_time - start_time
memory_info2 = psutil.Process().memory_info().rss
# In thời gian chạy
print("Thời gian chạy: ", execution_time, " giây")

memory_usage = (memory_info2-memory_info) / 1024  # Chuyển từ byte sang kilobyte

# In thông tin về bộ nhớ
print("Bộ nhớ cần sử dụng: ", memory_usage, " kilobyte")