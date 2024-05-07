SQLGETPROBLEMS=""" 
    select tblProblem.ProblemId,tblProblem.ProblemName,tblProblem.Point,isnull(temp1.TotalSubmit,0) as TotalSubmit,CONCAT(ISNULL(temp1.RateAC,0),'%') as RateAC
from (select tblProblemInContest.ProblemId as id, 
	count(tblSubmissions.SubmissionId) as TotalSubmit,
	count(case when tblSubmissions.SubStatus='AC' then 1 end)*100/count(tblSubmissions.SubmissionId) as RateAC
from tblProblemInContest join tblSubmissions 
	on tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId
group by tblProblemInContest.ProblemId) temp1 right join tblProblem on temp1.id=tblProblem.ProblemId
where tblProblem.ProblemName like ? and tblProblem.Point like ? and 
	tblProblem.ProblemTypeId like ?
"""
SQLGETPROBLEMSAC="""
	select tblProblem.ProblemId,tblProblem.ProblemName,tblProblem.Point from
		(select distinct ProblemId from
			(select distinct ProblemInContestId from tblSubmissions
			where tblSubmissions.SubStatus='AC' and tblSubmissions.UserName like ?)
			temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) 
		temp2 join tblProblem on temp2.ProblemId=tblProblem.ProblemId
	order by tblProblem.Point desc
"""
SQLGETTYPEPROBLEMSAC="""
	select tblProblem.ProblemTypeId,
		(select tblProblemType.ProblemTypeName from tblProblemType where tblProblemType.ProblemTypeId=tblProblem.ProblemTypeId) as TypeProblem,
		count(tblProblem.ProblemId) as Quantity
	from
		(select distinct ProblemId from
			(select distinct ProblemInContestId from tblSubmissions
			where tblSubmissions.SubStatus='AC' and tblSubmissions.UserName like ?)
			temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) 
		temp2 join tblProblem on temp2.ProblemId=tblProblem.ProblemId
	group by tblProblem.ProblemTypeId
	order by Quantity desc
"""
SQLGETINFACCOUNT="""
	select a.TotalSubmit,a.TotalSubAC,b.TotalProblemAC,a.RateAC
	from (select count(tblSubmissions.SubmissionId) as TotalSubmit, count(case when tblSubmissions.SubStatus='AC' then 1 end) as TotalSubAC,
				count(case when tblSubmissions.SubStatus='AC' then 1 end)*100.0/count(tblSubmissions.SubmissionId) as RateAC
			from tblSubmissions
			where tblSubmissions.UserName like ?) a, 
			(select count(ProblemId) as TotalProblemAC from
			(select distinct ProblemInContestId from tblSubmissions
			where tblSubmissions.SubStatus='AC' and tblSubmissions.UserNamelike ?)
			temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) b

"""
SQLGETSUBMITSSIONS="""
	select tblSubmissions.SubmissionId, 
		(select (select tblProblem.ProblemName from tblProblem where tblProblem.ProblemId=temp1.ProblemId) from 
			(select tblProblemInContest.ProblemId from tblProblemInContest 
			where tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId and tblProblemInContest.ProblemId like ?) temp1) as ProblemName,
			tblSubmissions.SubStatus,tblSubmissions.SubmissionTime,tblSubmissions.LanguageName,
			tblSubmissions.TotalTime,tblSubmissions.Memory,
				(select (select tblProblem.Point from tblProblem where tblProblem.ProblemId=temp1.ProblemId) from 
				(select tblProblemInContest.ProblemId from tblProblemInContest 
				where tblProblemInContest.ProblemInContestId=tblSubmissions.ProblemInContestId and tblProblemInContest.ProblemId like ?) temp1)
			as Point,
		tblSubmissions.UserName
	from tblSubmissions
	where tblSubmissions.UserName like ?
		and tblSubmissions.SubStatus like ?
		and tblSubmissions.LanguageName like ?
	order by tblSubmissions.SubmissionTime desc
	--order by tblSubmissions.TotalTime desc

"""
SQLGETRANKING="""
	select tblAccount.UserName,tblAccount.FullName, 
			(select count(ProblemId)  from
			(select distinct ProblemInContestId from tblSubmissions
			where tblSubmissions.SubStatus='AC' and tblSubmissions.UserName=tblAccount.UserName)
			temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) as TotalProblemAC,

			isnull((select sum(tblProblem.Point) from (select ProblemId  from
			(select distinct ProblemInContestId from tblSubmissions
			where tblSubmissions.SubStatus='AC' and tblSubmissions.UserName=tblAccount.UserName)
			temp1 join tblProblemInContest on temp1.ProblemInContestId=tblProblemInContest.ProblemInContestId) temp1 
			join tblProblem on temp1.ProblemId=tblProblem.ProblemId),0) as TotalPointProblemAC
	from tblAccount
	order by TotalPointProblemAC desc
"""

SQLGETTYPEPROPLEMS="""
	select tblProblemType.ProblemTypeId,tblProblemType.ProblemTypeName 
	from tblProblemType
	where tblProblemType.ProblemTypeName like ?
"""





