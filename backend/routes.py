import flask
from SQLQuery import *
from Main import executeSqlQuery
all=flask.Blueprint('all', __name__)

@all.route('/Problems', methods=['GET'])
def getAllProblem():
    return executeSqlQuery(SQLGETALLPROBLEM)
@all.route('/Problem/<name>', methods=['GET'])
def getProblemByName(name="hello"):
    return executeSqlQuery(SQLGETPROBLEMBYNAME,f"%{name}%")
@all.route('/Problem/<typeid>', methods=['GET'])
def getProblemByType(typeid="pbt1"):
    return executeSqlQuery(SQLGETPROBLEMBYTYPE,f"%{typeid}%")

@all.route('/Accounts', methods=['GET'])
def getAllAccount():
    return executeSqlQuery(SQLGETALLACCOUNT)
@all.route('/Account/<name>', methods=['GET'])
def getAccountByName(name="hello"):
    return executeSqlQuery(SQLGETACCOUNTBYNAME,f"%{name}%")

@all.route('/Contests', methods=['GET'])
def getAllContest():
    return executeSqlQuery(SQLGETALLCONTEST)
@all.route('/Contest/<name>', methods=['GET'])
def getContestByName(name=""):
    return executeSqlQuery(SQLGETCONTESTBYNAME,f"%{name}%")

@all.route('/Submissions', methods=['GET'])
@all.route('/Submissions/<isAsc>', methods=['GET'])
def getAllSubmission(isAsc=1):
    isAsc=(int)(isAsc)
    return executeSqlQuery(SQLGETALLSUBMITSSIONS+("asc" if isAsc else "desc"))