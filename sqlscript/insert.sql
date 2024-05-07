﻿--delete bảng
delete from tblSubmissions
delete from tblProblemInContest
delete from tblProblem
delete from tblProblemType
delete from tblAccount
delete from tblPermission
delete from tblLanguage
delete from tblContest
go
insert into tblContest
values(N'contest1','2024-01-02 13:00:00','2024-01-02 16:00:00',1,N'')

go
insert into tblLanguage
values(N'java',null)
insert into tblLanguage
values(N'python',null)
insert into tblLanguage
values(N'c/c++',null)
go
insert into tblPermission
values(N'pms1',N'Admin',N'quyền to nhất')
insert into tblPermission
values(N'pms2',N'Staff',N'quyền to nhì')
insert into tblPermission
values(N'pms3',N'User',N'Chỉ làm bài và thi')
go
insert into tblAccount
values(N'lvminh',N'123',N'pms3',N'Le van minh',1,'2024-01-01')
insert into tblAccount
values(N'lmhung',N'123',N'pms3',N'Ly manh hung',1,'2024-01-01')
insert into tblAccount
values(N'nqson',N'123',N'pms3',N'Nguyen quynh son',1,'2024-01-01')
go
insert into tblProblemType
values(N'pbt1',N'Cơ bản')
insert into tblProblemType
values(N'pbt2',N'Cơ bản-Phương pháp tính')
insert into tblProblemType
values(N'pbt3',N'Cơ bản-Thuật toán')
go
insert into tblProblem
values(N'Hello World',N'pb1',N'pbt1'
	,1,N'In ra dòng chữ "hello world" ra màn hình',1) 
insert into tblProblem
values(N'SumAB',N'pb2',N'pbt1'
	,1,N'In ra màn hình kết quả của a+b',1)
insert into tblProblem
values(N'MulAB',N'pb3',N'pbt2'
	,1,N'In ra màn hình kết quả của a*b',1)
insert into tblProblem
values(N'DivAB',N'pb4',N'pbt2'
	,1,N'In ra màn hình kết quả của a/b',1)
insert into tblProblem
values(N'SubAB',N'pb5',N'pbt2'
	,2,N'In ra màn hình kết quả của a-b',1)
insert into tblProblem
values(N'Fib(a)',N'pb6',N'pbt3'
	,2,N'Tính số fibo thứ a với Fib(0)=1, Fib(1)=1',1)
go
insert into tblProblemInContest
values(N'pbic1',N'contest1',N'pb1',1)
insert into tblProblemInContest
values(N'pbic2',N'contest1',N'pb2',1)
insert into tblProblemInContest
values(N'pbic3',N'contest1',N'pb3',1)
insert into tblProblemInContest
values(N'pbic4',null,N'pb4',1)
insert into tblProblemInContest
values(N'pbic5',null,N'pb3',1)
insert into tblProblemInContest
values(N'pbic6',null,N'pb2',1)
insert into tblProblemInContest
values(N'pbic7',null,N'pb5',1)
go
insert into tblSubmissions
values(N'sms1',N'pbic1',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','AC',100,0)

insert into tblSubmissions
values(N'sms2',N'pbic2',N'lvminh','2024-01-02 13:20:00',N'python','','1MB','00:00:00.004','AC',100,1)
insert into tblSubmissions
values(N'sms3',N'pbic4',N'lvminh','2024-01-02 13:20:00',N'python','','1MB','00:00:00.004','AC',100,1)
insert into tblSubmissions
values(N'sms4',N'pbic2',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','AC',100,1)
insert into tblSubmissions
values(N'sms5',N'pbic2',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','WA',30,1)
insert into tblSubmissions
values(N'sms6',N'pbic6',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','WA',30,1)
insert into tblSubmissions
values(N'sms7',N'pbic6',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','WA',20,1)
insert into tblSubmissions
values(N'sms8',N'pbic1',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','RTE',40,1)
insert into tblSubmissions
values(N'sms9',N'pbic1',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','RTE',50,1)
insert into tblSubmissions
values(N'sms10',N'pbic7',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','AC',100,1)