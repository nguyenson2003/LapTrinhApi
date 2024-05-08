import datetime
import string
import flask
from flask import json
from SQLQuery import * 
from SQLEdit import *
from Main import execuleSqlEdit, executeSqlQuery, justExeSqlQuery
all=flask.Blueprint('all', __name__)

@all.route('/problems', methods=['GET'])
def getProblems():
    name=flask.request.args.get('name',"")
    dif=flask.request.args.get('dif',"")
    type=flask.request.args.get('type',"")
    return executeSqlQuery(SQLGETPROBLEMS,f"%{name}%",f"%{dif}%",f"%{type}%")

@all.route('/problem/<id>', methods=['GET'])
def getProblem(id=''):
    return executeSqlQuery(SQLGETPROBLEM,id)

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

@all.route('/submissions/state', methods=['GET'])
def getAllState():
    return executeSqlQuery(SQLGETALLSTATE)





@all.route('/problems',methods=['post'])
def addProblem():
    name =flask.request.json.get('ProblemName',"")
    id = flask.request.json.get('ProblemId',"")
    idt=flask.request.json.get('ProblemTypeId',"")
    p=flask.request.json.get('Point',"")
    des=flask.request.json.get('Decribe',"")
    isActive=1
    if len(justExeSqlQuery(SQLGETPROBLEM,id))>0: 
        # TODO: đã tồn tại id problem
        return flask.jsonify({"mess":"đã tồn tại id problem"}) 
    if id=='' or idt=='' or not isinstance(p,int) or name=='':
        # TODO: id rỗng hoặc idtype rỗng hoặc điểm không nguyên hoặc name rỗng
        return flask.jsonify({"mess":"id rỗng hoặc idtype rỗng hoặc điểm không nguyên hoặc name rỗng"})
    if len(justExeSqlQuery(SQLGETPROBLEMTYPEBYID,idt))==0: 
        # TODO: không tồn tại kiểu bt này
        return flask.jsonify({"mess":"không tồn tại kiểu bt này"}) 
    return execuleSqlEdit(SQLINSPROBLEM,name,id,idt,p,des,isActive)
@all.route('/problems', methods=['put'])
def upProblem():
    id = flask.request.json.get('ProblemId',"")
    temp=justExeSqlQuery(SQLGETPROBLEM,id)
    if len(temp)==0 :
        # TODO: id problem k tồn tại
        return flask.jsonify({"mess":'id problem không tồn tại'})
    temp=temp[0]
    ProblemTypeId=flask.request.json.get('ProblemTypeId',temp['ProblemTypeId'])
    if len(justExeSqlQuery(SQLGETPROBLEMTYPEBYID,ProblemTypeId))==0:
        # TODO: id type problem k tồn tại
        return flask.jsonify({"mess":'id type problem k tồn tại'}) 
    des = flask.request.json.get('Decribe',temp['Decribe'])
    p = flask.request.json.get('Point',temp['Point'])
    name = flask.request.json.get('ProblemName',temp['ProblemName'])
    return execuleSqlEdit(SQLUPDPROBLEM,des,p,name,ProblemTypeId,id)
@all.route('/problems',methods=['delete'])
def delProblem():
    id = flask.request.json.get('ProblemId',"")
    if len(justExeSqlQuery(SQLGETPROBLEM,id))>1:
        # TODO: id problem sai
        return flask.jsonify({"mess":'id problem sai'})
    return execuleSqlEdit(SQLDELPROBLEM,id)



@all.route('/accounts',methods=['post'])
def addAccount():
    UserName =flask.request.json.get('UserName',"")
    PassWord = flask.request.json.get('PassWord',"")
    PermissionId=flask.request.json.get('PermissionId',"")
    FullName=flask.request.json.get('FullName',"")
    isActive=1
    DateCreate=datetime.datetime.now()
    if len(justExeSqlQuery(SQLGETACCOUNTBYUSERNAME,UserName))>0: 
        # TODO: đã tồn tại username
        return flask.jsonify({"mess":"đã tồn tại username"}) 
    if UserName=='' or PassWord=='' or FullName=="" or PermissionId=='':
        # TODO: username hoặc pass hoặc idpermission hoặc fullname rỗng
        return flask.jsonify({"mess":"username hoặc pass hoặc idpermission hoặc fullname rỗng"})
    if len(justExeSqlQuery(SQLGETPERMISSIONTYPEBYID,PermissionId))==0: 
        # TODO: Không tồn tại permission này
        return flask.jsonify({"mess":"Không tồn tại permission này"}) 
    return execuleSqlEdit(SQLADDACCOUNT,UserName,PassWord,PermissionId,FullName,isActive,DateCreate)
@all.route('/accounts', methods=['put'])
def upAccount():
    UserName =flask.request.json.get('UserName',"")
    temp=justExeSqlQuery(SQLGETACCOUNTBYUSERNAME,UserName)
    if len(temp)==0 :
        # TODO: username không tồn tại
        return flask.jsonify({"mess":'username không tồn tại'}) 
    temp=temp[0]
    PassWord = flask.request.json.get('PassWord',temp['PassWord'])
    PermissionId=flask.request.json.get('PermissionId',temp['PermissionId'])
    if len(justExeSqlQuery(SQLGETPERMISSIONTYPEBYID,PermissionId))==0:
        # TODO: không tồn tại permission id này
        return flask.jsonify({"mess":'không tồn tại permission id này'})
    FullName=flask.request.json.get('FullName',temp['PermissionId'])
    return execuleSqlEdit(SQLEDITACCOUNT,PassWord,PermissionId,FullName,UserName)
@all.route('/accounts',methods=['delete'])
def delAccount():
    UserName =flask.request.json.get('UserName',"")
    return execuleSqlEdit(SQLDELACCOUNT,UserName)



@all.route('/submissions',methods=['post'])
def addSubmission():
    ProblemInContestId=flask.request.json.get('ProblemInContestId',"")
    UserName=flask.request.json.get('UserName',"")
    SubmissionTime=datetime.datetime.now()
    LanguageName=flask.request.json.get('LanguageName',"")
    TheAnswer=flask.request.json.get('TheAnswer',"")
    Memory=flask.request.json.get('Memory',"")
    TotalTime=flask.request.json.get('TotalTime',"")
    SubStatus=flask.request.json.get('SubStatus',"")
    Point=flask.request.json.get('Point',"")
    isActive=1
    if ProblemInContestId=='' or UserName=='' or LanguageName=='' or\
        TheAnswer=='' or Memory=='' or TotalTime=="" or SubStatus==''or Point=='':
        # TODO: 1 trong các giá trị not null bị null
        return flask.jsonify({"mess":"1 trong các giá trị not null bị null"})
    if len(justExeSqlQuery(SQLGETACCOUNTBYUSERNAME,UserName))==0: 
        # TODO: không tồn tại username này
        return flask.jsonify({"mess":"không tồn tại username này"}) 
    if len(justExeSqlQuery(SQLGETPROBLEMINCONTESTTYPEBYID,ProblemInContestId))==0: 
        # TODO: không tồn tại id problem in contest này
        return flask.jsonify({"mess":"không tồn tại id problem in contest này"}) 
    if len(justExeSqlQuery(SQLGETLANGUAGEBYNAME,LanguageName))==0: 
        # TODO: không tồn tại ngôn ngữ này
        return flask.jsonify({"mess":"không tồn tại ngôn ngữ này"}) 
    if not isinstance(Point,int):
        # TODO: Point phải là số nguyên
        return flask.jsonify({"mess":"Point phải là số nguyên"}) 
    if Point>100:
        # TODO: Point phải nhỏ hơn 100
        return flask.jsonify({"mess":"Point phải nhỏ hơn 100"}) 
    
    temp =TotalTime.split(':')
    if len(temp) != 3:
        return flask.jsonify({"mess":"Tổng thời gian phải ở dạng H:M:S.f với 00<=H<=23, 00<=m,s<=59"})
    hours = int(temp[0])
    minutes = int(temp[1])
    seconds = float(temp[2])
    if not(0 <= hours <= 23 and 0 <= minutes <= 59 and 0 <= seconds < 60):
        return flask.jsonify({"mess":"Tổng thời gian phải ở dạng H:M:S.f với 00<=H<=23, 00<=m,s<=59"}) 
    return execuleSqlEdit(SQLADDSUBMISSION,ProblemInContestId,UserName,SubmissionTime,LanguageName,
                          TheAnswer,Memory,TotalTime,SubStatus,Point,isActive)

