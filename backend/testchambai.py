import os
import subprocess

# Chạy tệp Python khác với tham số đầu vào
rel_path = os.path.dirname(__file__)
file_path_python=os.path.join(rel_path, 'pythoncode.py')
temp=subprocess.run(['python', file_path_python, '1'])
print(temp.stdout)