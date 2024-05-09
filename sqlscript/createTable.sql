use master
go
drop database btl_laptrinhapi
go
create database btl_laptrinhapi
go
use btl_laptrinhapi
go
create table tblPermission(
	PermissionId	nvarchar(100)	not null	primary key,
	PermissionName	nvarchar(100)	not null,
	Describe	nvarchar(100),
);
go

create table tblAccount(
	UserName	nvarchar(100)	not null	primary key,
	PassWord	nvarchar(100)	not null,
	PermissionId	nvarchar(100) not null
		foreign key references tblPermission(PermissionId),
	FullName	nvarchar(100)	not null,
	isActive	int	default	1,
	DateCreate	datetime	not null
);

go
create table tblContest(
	ContestName		nvarchar(100)	not null	primary key,
	StartTime	datetime not null,
	EndTime datetime not null,
	IsPublic int not null,
	Describe nvarchar(100)
);
go
create table tblProblemType(
	ProblemTypeId nvarchar(100) not null primary key,
	ProblemTypeName nvarchar(100) not null
);
go
create table tblProblem(
	ProblemName nvarchar(100) not null,
	ProblemId nvarchar(100) not null primary key,
	ProblemTypeId nvarchar(100) not null
		foreign key references tblProblemType(ProblemTypeId),
	Point int not null,
	Decribe nvarchar(max),
	TimeLimit float not null,
	MemoryLimit int not null,
	isActive int default 1
);

create table tblTestCaseFile(
	ProblemId nvarchar(100) not null primary key
		foreign key references tblProblem(ProblemId),
	FileZip varbinary(max) not null,
	NumberTestcase int not null
);
go
create table tblLanguage(
	LanguageName nvarchar(100) not null primary key,
	Decribe nvarchar(100)
);
go
create table tblProblemInContest(
	ProblemInContestId nvarchar(100) not null primary key,
	ContestName nvarchar(100) 
		foreign key references tblContest(ContestName),
	ProblemId nvarchar(100) not null
		foreign key references tblProblem(ProblemId),
	isActive int default 1
);
go 
create table tblSubmissions(
	SubmissionId INT IDENTITY(1,1) primary key,
	ProblemInContestId nvarchar(100) not null
		foreign key references tblProblemInContest(ProblemInContestId),
	UserName nvarchar(100) not null
		foreign key references tblAccount(UserName),
	SubmissionTime datetime not null,
	LanguageName nvarchar(100) not null
		foreign key references tblLanguage(LanguageName),
	TheAnswer varchar(max) not null,
	Memory int ,
	TotalTime float,
	SubStatus varchar(100),
	Point int ,
	isActive int default 1
);
go 
create table tblJoinContestDetail(
	ContestName		nvarchar(100)	not null
		foreign key references tblContest(ContestName),
	UserName	nvarchar(100)	not null
		foreign key references tblAccount(UserName),
	isActive int default 1
);
