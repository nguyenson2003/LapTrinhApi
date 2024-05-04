--Các câu lệnh truy vấn 
select * from tblProblem

select * from tblProblem where tblProblem.ProblemName like '%ab%'

select * from tblProblem where tblProblem.ProblemTypeId='pbt2'

select * from tblContest

select * from tblContest where tblContest.ContestName like '%ab%'

select * from tblAccount

select * from tblAccount where tblAccount.FullName like '%ab%'

select * from tblSubmissions
order by tblSubmissions.SubmissionTime desc

select * from tblSubmissions
where tblSubmissions.UserName = 'lvminh'
order by tblSubmissions.SubmissionTime desc

--TÌm tất cả bài tập
select tblProblem.ProblemId,tblProblem.ProblemName,tblProblem.Point,isnull(temp1.TotalSubmit,0) as TotalSubmit,ISNULL(temp1.RateAC,0) as RateAC
from (select tblProblemInContest.ProblemId as id, 
	count(tblSubmissions.SubmissionId) as TotalSubmit,
	count(case when tblSubmissions.SubStatus='AC' then 1 end)*100.0/count(tblSubmissions.SubmissionId) as RateAC
from tblProblemInContest join tblSubmissions 
	on tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId
group by tblProblemInContest.ProblemId) temp1 right join tblProblem on temp1.id=tblProblem.ProblemId
--where tblProblem.ProblemName like '%ab%'
--where tblProblem.Point = 1
where tblProblem.ProblemTypeId=(select tblProblemType.ProblemTypeId from tblProblemType where tblProblemType.ProblemTypeName=N'Cơ bản-Phương pháp tính')

--Tìm tất cả bài tập đã AC của 1 người
select tblProblem.ProblemId,tblProblem.ProblemName,tblProblem.Point from
	(select distinct ProblemId from
		(select distinct ProblemInContestId from tblSubmissions
		where tblSubmissions.SubStatus='AC' and tblSubmissions.UserName='lvminh')
		temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) 
	temp2 join tblProblem on temp2.ProblemId=tblProblem.ProblemId
order by tblProblem.Point desc

--các loại bài tập đã AC của 1 người
select tblProblem.ProblemTypeId,
	(select tblProblemType.ProblemTypeName from tblProblemType where tblProblemType.ProblemTypeId=tblProblem.ProblemTypeId) as TypeProblem,
	count(tblProblem.ProblemId) as Quantity
from
	(select distinct ProblemId from
		(select distinct ProblemInContestId from tblSubmissions
		where tblSubmissions.SubStatus='AC' and tblSubmissions.UserName='lvminh')
		temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) 
	temp2 join tblProblem on temp2.ProblemId=tblProblem.ProblemId
group by tblProblem.ProblemTypeId
order by Quantity desc

--thông tin tài khoản
select a.TotalSubmit,a.TotalSubAC,b.TotalProblemAC,a.RateAC
from (select count(tblSubmissions.SubmissionId) as TotalSubmit, count(case when tblSubmissions.SubStatus='AC' then 1 end) as TotalSubAC,
			count(case when tblSubmissions.SubStatus='AC' then 1 end)*100.0/count(tblSubmissions.SubmissionId) as RateAC
		from tblSubmissions
		where tblSubmissions.UserName='lvminh') a, 
		(select count(ProblemId) as TotalProblemAC from
		(select distinct ProblemInContestId from tblSubmissions
		where tblSubmissions.SubStatus='AC' and tblSubmissions.UserName='lvminh')
		temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) b

--các bài nộp
select tblSubmissions.SubmissionId, 
	(select (select tblProblem.ProblemName from tblProblem where tblProblem.ProblemId=temp1.ProblemId) from 
		(select tblProblemInContest.ProblemId from tblProblemInContest 
		where tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId and tblProblemInContest.ProblemId like '%%') temp1) as ProblemName,
		tblSubmissions.SubStatus,tblSubmissions.SubmissionTime,tblSubmissions.LanguageName,
		tblSubmissions.TotalTime,tblSubmissions.Memory,
			(select (select tblProblem.Point from tblProblem where tblProblem.ProblemId=temp1.ProblemId) from 
			(select tblProblemInContest.ProblemId from tblProblemInContest 
			where tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId and tblProblemInContest.ProblemId like '%%') temp1)
		 as Point,
	tblSubmissions.UserName
from tblSubmissions
--where tblSubmissions.UserName='lvminh'
--where tblSubmissions.SubStatus='AC'
where tblSubmissions.LanguageName='java'


select *
	from tblSubmissions join tblSubmissions 
		on tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId
SELECT ROUND(12.3456789,3) as Result;