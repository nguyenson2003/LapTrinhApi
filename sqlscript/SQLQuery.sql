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