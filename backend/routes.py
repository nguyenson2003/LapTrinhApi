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

@all.route('/problem/<id>', methods=['GET'])
def getProblem(id=''):
    return executeSqlQuery(SQLGETPROBLEM,f"%{id}%")

@all.route('/typeprob',methods=['get'])
def getTypeProblems():
    name=flask.request.args.get('name',"")
    return executeSqlQuery(SQLGETTYPEPROBLEMS,f"%{name}%")
    # return executeSqlQuery(SQLTEMP,name)

@all.route('/problems/<username>/ac',methods=['GET'])
def getProblemsAC(username=""):
    return executeSqlQuery(SQLGETPROBLEMSAC,f"%{username}%",f"%{username}%")

@all.route('/typeprob/<username>/ac',methods=['GET'])
def getTypeProblemsAC(username=""):
    return executeSqlQuery(SQLGETTYPEPROBLEMSAC,f"%{username}%",f"%{username}%")

@all.route('/infacc/<username>',methods=['GET'])
def getInforAccount(username=""):
    return executeSqlQuery(SQLGETINFACCOUNT,f"%{username}%",f"%{username}%",f"%{username}%",f"%{username}%")

@all.route('/submissions', methods=['GET'])
def getSubmitssions():
    idp=flask.request.args.get('idprob',"")
    un=flask.request.args.get('un',"")
    subs=flask.request.args.get('substate',"")
    lg=flask.request.args.get('sublg',"")
    # name=dif=type=""
    return executeSqlQuery(SQLGETSUBMITSSIONS,f"%{idp}%",f"%{idp}%",f"%{un}%",f"%{subs}%",f"%{lg}%")

@all.route('/rank', methods=['GET'])
def getRanking():
    return executeSqlQuery(SQLGETRANKING)

