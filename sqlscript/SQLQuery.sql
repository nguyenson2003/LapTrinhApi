--Các câu lệnh truy vấn 


--TÌm tất cả bài tập
select tblProblem.ProblemId, 
		tblProblem.ProblemName,
		tblProblem.Point,
		isnull(temp1.TotalSubmit,0) as TotalSubmit,
		CONCAT(ISNULL(temp1.RateAC,0),'%') as RateAC,
		tblProblem.TimeLimit,
		tblProblem.MemoryLimit
from (	
	select tblProblemInContest.ProblemId as id, 
		sum(tblSubmissions.isActive) as TotalSubmit,
		count(case when tblSubmissions.SubStatus='AC' and tblSubmissions.isActive=1 then 1 end) * 100/sum(tblSubmissions.isActive) as RateAC
	from tblProblemInContest join tblSubmissions 
		on tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId
	group by tblProblemInContest.ProblemId
	) temp1 right join tblProblem on temp1.id=tblProblem.ProblemId
where tblProblem.isActive=1
	and tblProblem.ProblemName like N'%%' 
	and tblProblem.Point like '%%'
	and tblProblem.ProblemTypeId like '%%'

--Thông tin 1 bài tập
select * 
from tblProblem
where tblProblem.isActive=1
	and tblProblem.ProblemId like '%%'

--tất cả loại đề bài
select tblProblemType.ProblemTypeId,tblProblemType.ProblemTypeName 
from tblProblemType
where tblProblemType.ProblemTypeName like N'%C%'

--Tìm tất cả bài tập đã AC của 1 người
select tblProblem.ProblemId,
	tblProblem.ProblemName,
	tblProblem.Point 
from (
	select distinct ProblemId 
	from (
		select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.SubStatus like '%AC%' 
			and tblSubmissions.UserName like '%lvminh%' 
			and (
				select count(*) 
				from tblAccount 
				where tblAccount.isActive=1 
					and tblAccount.UserName like '%lvminh%'
				)>=1
		)	temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
	)	temp2 join tblProblem 
		on temp2.ProblemId=tblProblem.ProblemId
where tblProblem.isActive=1
order by tblProblem.Point desc

--các loại bài tập đã AC của 1 người
select tblProblem.ProblemTypeId,
	(select tblProblemType.ProblemTypeName 
	from tblProblemType 
	where tblProblemType.ProblemTypeId=tblProblem.ProblemTypeId) as TypeProblem,
	count(tblProblem.ProblemId) as Quantity
from (
	select distinct ProblemId 
	from(
		select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.SubStatus like'%AC%' 
			and tblSubmissions.UserName like '%lvminh%'
			and(
				select count(*) 
				from tblAccount 
				where tblAccount.isActive=1 
					and tblAccount.UserName like '%lvminh%'
				)>=1
		)temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
	)temp2 join tblProblem 
		on temp2.ProblemId=tblProblem.ProblemId
where tblProblem.isActive=1 
group by tblProblem.ProblemTypeId
order by Quantity desc

--Số lượng bài tập đã AC theo độ khó của 1 người
select tblProblem.Point,
	count(tblProblem.ProblemId) as Quantity
from (
	select distinct ProblemId 
	from(
		select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.SubStatus like'%AC%' 
			and tblSubmissions.UserName like '%lvminh%'
			and(
				select count(*) 
				from tblAccount 
				where tblAccount.isActive=1 
					and tblAccount.UserName like '%lvminh%'
				)>=1
		)temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
	)temp2 join tblProblem 
		on temp2.ProblemId=tblProblem.ProblemId
where tblProblem.isActive=1 
group by tblProblem.Point
order by Quantity desc

--thông tin tài khoản
select tblAccount.UserName,
	tblAccount.DateCreate,
	a.TotalSubmit,
	a.TotalSubAC,
	b.TotalProblemAC,
	a.RateAC
from tblAccount,
	(select count(tblSubmissions.SubmissionId) as TotalSubmit,
		count(case when tblSubmissions.SubStatus like '%AC%' then 1 end) as TotalSubAC,
		concat(count(case when tblSubmissions.SubStatus like '%AC%' then 1 end)*100/count(tblSubmissions.SubmissionId),'%') as RateAC
	from tblSubmissions
	where tblSubmissions.UserName like '%lvminh%') a,
	(select count(ProblemId) as TotalProblemAC 
	from(
		select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.SubStatus like '%AC%' 
			and tblSubmissions.UserName like '%lvminh%'
		)temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
	) b
where tblAccount.isActive=1
	and tblAccount.UserName like '%lvminh%'




--các bài nộp
select tblSubmissions.SubmissionId,
	tblProblemInContest.ProblemId,
	(select tblProblem.ProblemName
	from tblProblem
	where tblProblem.ProblemId=tblProblemInContest.ProblemId) as ProblemName,
	tblSubmissions.SubStatus,
	CONVERT(VARCHAR(20),tblSubmissions.SubmissionTime, 108)+'-'+CONVERT(VARCHAR(20), tblSubmissions.SubmissionTime, 103) AS DateSub,
	tblSubmissions.LanguageName,
	concat(DATEPART(MINUTE, tblSubmissions.TotalTime)*60+DATEPART(SECOND, tblSubmissions.TotalTime) + (DATEPART(MILLISECOND,tblSubmissions.TotalTime) / 1000.0),'s') AS RunTime,
	tblSubmissions.Memory,
	concat(tblSubmissions.Point,'/100'),
	(select tblAccount.FullName
	from tblAccount
	where tblAccount.UserName=tblSubmissions.UserName) as FullName,
	tblSubmissions.UserName
from tblSubmissions join tblProblemInContest
	on tblSubmissions.ProblemInContestId=tblProblemInContest.ProblemInContestId
where tblSubmissions.isActive=1
	and tblSubmissions.UserName like '%lvminh%'
	and tblSubmissions.SubStatus like '%AC%'
	and tblProblemInContest.ProblemId like '%pb1%'
	and tblSubmissions.LanguageName like '%java%'
	and tblSubmissions.SubmissionId=''
--bảng xếp hạng
select tblAccount.UserName,
	tblAccount.FullName, 
	(select count(ProblemId)  
	from
		(select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.SubStatus like '%%' 
			and tblSubmissions.UserName=tblAccount.UserName
	)temp1 join tblProblemInContest 
	on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) as TotalProblemAC,
	isnull((
		select sum(tblProblem.Point) 
		from (
			select ProblemId  
			from
				(select distinct ProblemInContestId 
				from tblSubmissions
				where tblSubmissions.SubStatus like '%AC%' 
					and tblSubmissions.UserName=tblAccount.UserName
				)
			temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
		) temp2 join tblProblem 
		on temp2.ProblemId=tblProblem.ProblemId),0) as TotalPointProblemAC
from tblAccount
where tblAccount.isActive=1
order by TotalPointProblemAC desc





--thêm bt
insert into tblProblem
values(N'Hello World',N'pb1',N'pbt1'
	,1,N'In ra dòng chữ "hello world" ra màn hình',1) 


select N'cơ bản' as temp
--sửa bt
update tblProblem 
set Decribe='a',
	isActive=1,
	Point=2,
	ProblemName='b'
where tblProblem.ProblemId like '%pb1%'
select * from tblProblem
--xóa bt
update tblProblem 
set isActive=0
where tblProblem.ProblemId like '%pb1%'

--tìm problem type by id
select * 
from tblProblemType
where tblProblemType.ProblemTypeId like '%pbt1%'

--thêm tk
insert into tblAccount
values(N'lvminh',N'123',N'pms3',N'Le van minh',1,'2024-01-01')

--sửa tk
update tblAccount 
set PassWord='',
	PermissionId='pms3',
	FullName=''
where tblAccount.UserName = 'lvminh'

--del tk
update tblAccount 
set isActive=0
where tblAccount.UserName = 'lvminh'

--get account by un
select * 
from tblAccount
where tblAccount.UserName='lvminh'

--get quyền by id
select * 
from tblPermission
where tblPermission.PermissionId=''

--nộp bài tập
insert into tblSubmissions
values(N'pbic1',N'lvminh','2024-01-02 13:10:00',N'java','','1MB','00:00:00.004','AC',100,0)


--getProblemInContestby id
select * 
from tblProblemInContest
where tblProblemInContest.ProblemInContestId=''

--getlanguage
select * 
from tblLanguage
where tblLanguage.LanguageName=''

--lấy tất cả loại trạng thái khi sub
select distinct tblSubmissions.SubStatus
from tblSubmissions

--get all test file
select * 
from tblTestCaseFile
--delete file zip cũ
DELETE FROM tblTestCaseFile
WHERE tblTestCaseFile.ProblemId=''
--get test num by id
select tblTestCaseFile.NumberTestcase 
from tblTestCaseFile
where tblTestCaseFile.ProblemId=''
select tblTestCaseFile.FileZip
from tblTestCaseFile
where tblProblem.ProblemId=''
select tblTestCaseFile.NumberTestcase,tblTestCaseFile.FileZip
	from tblTestCaseFile
	where tblTestCaseFile.ProblemId='pb1'
select tblProblemInContest.ProblemId,tblSubmissions.LanguageName,tblSubmissions.TheAnswer
from tblSubmissions join tblProblemInContest 
on tblSubmissions.ProblemInContestId=tblProblemInContest.ProblemInContestId
where tblSubmissions.SubmissionId=1

--kiem tra tai khoan
SELECT CASE
    WHEN tblAccount.PassWord='123' and tblAccount.PermissionId like '%nhanvien%' THEN 'True'
    ELSE 'False'
END AS results
FROM tblAccount
where tblAccount.UserName='lvminh'


select * from tblProblemInContest


