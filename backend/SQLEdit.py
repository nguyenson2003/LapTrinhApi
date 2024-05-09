SQLINSPROBLEM="""
insert into tblProblem
values(?,?,?
	,?,?,?,?,?) 
"""
SQLINSPROBLEMINCONTEST="""
insert into tblProblemInContest
values(?,null,?,?) 
"""
SQLUPDPROBLEM="""
    update tblProblem 
    set Decribe=?,
        Point=?,
        ProblemName=?
        ProblemTypeId=?
    where tblProblem.ProblemId = ?
"""
SQLDELPROBLEM="""
update tblProblem 
set isActive=0
where tblProblem.ProblemId = ?
"""
SQLADDACCOUNT="""
insert into tblAccount
values(?,?,?,?,?,?)
"""
SQLEDITACCOUNT="""
update tblAccount 
set PassWord=?,
	PermissionId=?,
	FullName=?
where tblAccount.UserName = ?
"""
SQLDELACCOUNT="""
    update tblAccount 
    set isActive=0
    where tblAccount.UserName = ?
"""

SQLADDSUBMISSION="""
insert into tblSubmissions
values(?,?,?,?,?,?,?,?,?,?)
"""

SQLADDTESTCASEFILE="""
insert into tblTestCaseFile
values(?,?,?)

"""

SQLDELOLDFILEZIP="""
DELETE FROM tblTestCaseFile
WHERE tblTestCaseFile.ProblemId=?
"""

SQLUPDATESUB="""
update tblSubmissions
set Memory=?,TotalTime=?,SubStatus=?,Point=?
where tblSubmissions.SubmissionId=?
"""