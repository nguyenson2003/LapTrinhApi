import flask
from SQLQuery import * 
from SQLEdit import *
from Main import execuleSqlEdit, executeSqlQuery
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

@all.route('/typeprob/<username>/orderbydif',methods=['GET'])
def getTypeProblemsOrderbydif(username=""):
    return executeSqlQuery(SQLGETPROBLEMSACORDERBYDIFFICULT,f"%{username}%",f"%{username}%")

@all.route('/infacc/<username>',methods=['GET'])
def getInforAccount(username=""):
    return executeSqlQuery(SQLGETINFACCOUNT,f"%{username}%",f"%{username}%",f"%{username}%")

@all.route('/submissions', methods=['GET'])
def getSubmitssions():
    idp=flask.request.args.get('idprob',"")
    un=flask.request.args.get('un',"")
    subs=flask.request.args.get('substate',"")
    lg=flask.request.args.get('sublg',"")
    # name=dif=type=""
    return executeSqlQuery(SQLGETSUBMITSSIONS,f"%{un}%",f"%{subs}%",f"%{idp}%",f"%{lg}%")

@all.route('/rank', methods=['GET'])
def getRanking():
    return executeSqlQuery(SQLGETRANKING)


@all.route('/problems/edit', methods=['put'])
def delProblems():
    id = flask.request.json.get('ProblemId')
    temp=executeSqlQuery(SQLGETPROBLEM,f"%{id}%")
    des = flask.request.json.get('Decribe',temp[0]['Decribe'])
    p = flask.request.json.get('Point',temp[0]['Point'])
    name = flask.request.json.get('ProblemName',temp[0]['ProblemName'])
    return execuleSqlEdit(SQLUPDPROBLEM,des,p,name,id)


    
