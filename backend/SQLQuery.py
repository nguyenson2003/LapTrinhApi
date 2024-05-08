SQLGETPROBLEMS=""" 
    select tblProblem.ProblemId, 
			tblProblem.ProblemName,
			tblProblem.Point,
			isnull(temp1.TotalSubmit,0) as TotalSubmit,
			CONCAT(ISNULL(temp1.RateAC,0),'%') as RateAC,
			concat(tblProblem.TimeLimit,'s') as TimeLimit,
			concat(tblProblem.MemoryLimit,'kb')as MemoryLimit
	from (	
		select tblProblemInContest.ProblemId as id, 
			sum(tblSubmissions.isActive) as TotalSubmit,
			count(case when tblSubmissions.SubStatus='AC' and tblSubmissions.isActive=1 then 1 end) * 100/sum(tblSubmissions.isActive) as RateAC
		from tblProblemInContest join tblSubmissions 
			on tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId
		group by tblProblemInContest.ProblemId
		) temp1 right join tblProblem on temp1.id=tblProblem.ProblemId
	where tblProblem.isActive=1
		and tblProblem.ProblemName like ? 
		and tblProblem.Point like ?
		and tblProblem.ProblemTypeId like ?
"""
SQLGETTYPEPROBLEMS="""
	select tblProblemType.ProblemTypeId,tblProblemType.ProblemTypeName 
	from tblProblemType
	where tblProblemType.ProblemTypeName like ?
"""

SQLGETPROBLEMSAC="""
	select tblProblem.ProblemId,
		tblProblem.ProblemName,
		tblProblem.Point 
	from (
		select distinct ProblemId 
		from (
			select distinct ProblemInContestId 
			from tblSubmissions
			where tblSubmissions.SubStatus like '%AC%' 
				and tblSubmissions.UserName like ? 
				and (
					select count(*) 
					from tblAccount 
					where tblAccount.isActive=1 
						and tblAccount.UserName like ?
					)>=1
			)	temp1 join tblProblemInContest 
				on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
		)	temp2 join tblProblem 
			on temp2.ProblemId=tblProblem.ProblemId
	where tblProblem.isActive=1
	order by tblProblem.Point desc
"""
SQLGETTYPEPROBLEMSAC="""
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
				and tblSubmissions.UserName like ?
				and(
					select count(*) 
					from tblAccount 
					where tblAccount.isActive=1 
						and tblAccount.UserName like ?
					)>=1
			)temp1 join tblProblemInContest 
				on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
		)temp2 join tblProblem 
			on temp2.ProblemId=tblProblem.ProblemId
	where tblProblem.isActive=1 
	group by tblProblem.ProblemTypeId
	order by Quantity desc
"""

SQLGETPROBLEMSACORDERBYDIFFICULT="""
select tblProblem.Point,
	count(tblProblem.ProblemId) as Quantity
from (
	select distinct ProblemId 
	from(
		select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.SubStatus like'%AC%' 
			and tblSubmissions.UserName like ?
			and(
				select count(*) 
				from tblAccount 
				where tblAccount.isActive=1 
					and tblAccount.UserName like ?
				)>=1
		)temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
	)temp2 join tblProblem 
		on temp2.ProblemId=tblProblem.ProblemId
where tblProblem.isActive=1 
group by tblProblem.Point
order by Quantity desc

"""


SQLGETINFACCOUNT="""
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
	where tblSubmissions.UserName like ?) a,
	(select count(ProblemId) as TotalProblemAC 
	from(
		select distinct ProblemInContestId 
		from tblSubmissions
		where tblSubmissions.SubStatus like '%AC%' 
			and tblSubmissions.UserName like ?
		)temp1 join tblProblemInContest 
			on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId
	) b
where tblAccount.isActive=1
	and tblAccount.UserName like ?
"""
SQLGETSUBMITSSIONS="""
select tblSubmissions.SubmissionId,
	tblProblemInContest.ProblemId,
	(select tblProblem.ProblemName
	from tblProblem
	where tblProblem.ProblemId=tblProblemInContest.ProblemId) as ProblemName,
	tblSubmissions.SubStatus,
	CONVERT(VARCHAR(20),tblSubmissions.SubmissionTime, 108)+'-'+CONVERT(VARCHAR(20), tblSubmissions.SubmissionTime, 103) AS DateSub,
	tblSubmissions.LanguageName,
	concat(TotalTime,'s') AS RunTime,
	concat(tblSubmissions.Memory,'kb') as memory,
	concat(tblSubmissions.Point,'/100') as Point,
	(select tblAccount.FullName
	from tblAccount
	where tblAccount.UserName=tblSubmissions.UserName) as FullName,
	tblSubmissions.UserName
from tblSubmissions join tblProblemInContest
	on tblSubmissions.ProblemInContestId=tblProblemInContest.ProblemInContestId
where tblSubmissions.isActive=1
	and tblSubmissions.UserName like ?
	and tblSubmissions.SubStatus like ?
	and tblProblemInContest.ProblemId like ?
	and tblSubmissions.LanguageName like ?
"""
SQLGETRANKING="""
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
"""



SQLGETPROBLEM="""
	select * 
	from tblProblem
	where tblProblem.isActive=1
		and tblProblem.ProblemId = ?
"""

SQLTEMP="""
	select ? as temp
"""

SQLGETPROBLEMTYPEBYID="""
	select * 
	from tblProblemType
	where tblProblemType.ProblemTypeId = ?
"""
SQLGETACCOUNTBYUSERNAME="""
	select * 
	from tblAccount
	where tblAccount.UserName=?
"""
SQLGETPERMISSIONTYPEBYID="""
	select * 
	from tblPermission
	where tblPermission.PermissionId=?
"""
SQLGETPROBLEMINCONTESTTYPEBYID="""
	select * 
	from tblProblemInContest
	where tblProblemInContest.ProblemInContestId=?
"""
SQLGETLANGUAGEBYNAME="""
	select * 
	from tblLanguage
	where tblLanguage.LanguageName=?
"""
SQLGETALLSTATE="""
	select distinct tblSubmissions.SubStatus
	from tblSubmissions
"""
SQLGETALLTESTFILE="""
	select * 
 	from tblTestCaseFile
"""
SQLGETNUMTESBYID="""
	select tblTestCaseFile.NumberTestcase,tblTestCaseFile.FileZip
	from tblTestCaseFile
	where tblTestCaseFile.ProblemId=?
"""

SQLGETTIMELIMBYIDP="""
select tblProblem.TimeLimit,tblProblem.MemoryLimit
from tblProblem
where tblProblem.ProblemId=?
"""
