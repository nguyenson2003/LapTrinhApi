import zipfile

# Đường dẫn đến file zip cần đọc
zip_file_path = "D:\\Documents\\GitHub\\LapTrinhApi\\backend\\textzip.zip"

# Mở file zip
with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
    # Liệt kê danh sách các file và thư mục trong zip
    file_list = zip_ref.namelist()
    print("Danh sách các file trong zip:", file_list)
    
    # Đọc nội dung của một file trong zip
    file_name = "example.txt"
    if file_name in file_list:
        with zip_ref.open(file_name) as file:
            content = file.read()
            print("Nội dung file", file_name, "trong zip:")
            print(content)
    else:
        print("File", file_name, "không tồn tại trong zip")