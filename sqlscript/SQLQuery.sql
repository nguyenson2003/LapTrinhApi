--Các câu lệnh truy vấn 


--TÌm tất cả bài tập
select tblProblem.ProblemId, 
		tblProblem.ProblemName,
		tblProblem.Point,
		isnull(temp1.TotalSubmit,0) as TotalSubmit,
		CONCAT(ISNULL(temp1.RateAC,0),'%') as RateAC
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

--thông tin tài khoản
select a.TotalSubmit,
	a.TotalSubAC,
	b.TotalProblemAC,
	a.RateAC
from (
	select count(tblSubmissions.SubmissionId) as TotalSubmit,
		count(case when tblSubmissions.SubStatus like '%AC%' then 1 end) as TotalSubAC,
		concat(count(case when tblSubmissions.SubStatus like '%AC%' then 1 end)*100/count(tblSubmissions.SubmissionId),'%') as RateAC
	from tblSubmissions
	where tblSubmissions.UserName like '%lvminh%'
		and(
			select count(*) 
			from tblAccount 
			where tblAccount.isActive=1 
				and tblAccount.UserName like '%lvminh%'
		)>=1
	) a, 
	(select count(ProblemId) as TotalProblemAC 
	from(
		select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.isActive=1 
			and tblSubmissions.SubStatus like '%AC%' 
			and tblSubmissions.UserName like '%lvminh%'
			and (
				select count(*) 
				from tblAccount 
				where tblAccount.isActive=1  
					and tblAccount.UserName like '%lvminh%')>=1
		)temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
	) b

--các bài nộp
select tblSubmissions.SubmissionId, 
	(select 
		(select tblProblem.ProblemName 
		from tblProblem 
		where tblProblem.ProblemId=temp1.ProblemId
			and tblProblem.isActive=1) 
	from 
		(select tblProblemInContest.ProblemId 
		from tblProblemInContest 
		where tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId 
			and tblProblemInContest.ProblemId like '%%'
		) temp1
	) as ProblemName,
	tblSubmissions.SubStatus,
	tblSubmissions.SubmissionTime,
	tblSubmissions.LanguageName,
	tblSubmissions.TotalTime,
	tblSubmissions.Memory,
	(select (
		select tblProblem.Point 
		from tblProblem 
		where tblProblem.ProblemId=temp1.ProblemId
			and tblProblem.isActive=1) 
	from 
		(select tblProblemInContest.ProblemId 
		from tblProblemInContest 
		where tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId 
			and tblProblemInContest.ProblemId like '%%') 
		temp1) as Point,
	tblSubmissions.UserName
from tblSubmissions
where tblSubmissions.UserName like '%lvminh%' 
	and tblSubmissions.SubStatus like '%AC%'
	and tblSubmissions.LanguageName like '%java%'
order by tblSubmissions.SubmissionTime desc
--order by tblSubmissions.TotalTime

--bảng xếp hạng
select tblAccount.UserName,
	tblAccount.FullName, 
	(	select count(ProblemId)  
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