import flask
from SQLQuery import *
from Main import executeSqlQuery
all=flask.Blueprint('all', __name__)
@all.route('/problems', methods=['GET'])
def getProblems():
    name=flask.request.args.get('name',"")
    dif=flask.request.args.get('dif',"")
    type=flask.request.args.get('type',"")
    return executeSqlQuery(SQLGETPROBLEMS,f"%{name}%",f"%{dif}%",f"%{type}%")
@all.route('/problems/ac/<username>',methods=['GET'])
def getProblemsAC(username=""):
    return executeSqlQuery(SQLGETPROBLEMSAC,f"%{username}%")
@all.route('/typeproblems/ac/<username>',methods=['GET'])
def getTypeProblemsAC(username=""):
    return executeSqlQuery(SQLGETTYPEPROBLEMSAC,f"%{username}%")
@all.route('/inforaccount/<username>',methods=['GET'])
def getInforAccount(username=""):
    return executeSqlQuery(SQLGETINFACCOUNT,f"%{username}%",f"%{username}%")
@all.route('/submissions', methods=['GET'])
def getSubmitssions():
    idp=flask.request.args.get('idp',"")
    un=flask.request.args.get('un',"")
    subs=flask.request.args.get('subs',"")
    lg=flask.request.args.get('lg',"")
    # name=dif=type=""
    return executeSqlQuery(SQLGETSUBMITSSIONS,f"%{idp}%",f"%{idp}%",f"%{un}%",f"%{subs}%",f"%{lg}%")
@all.route('/rank', methods=['GET'])
def getRanking():
    return executeSqlQuery(SQLGETRANKING)
# @all.route('/typeproblems')