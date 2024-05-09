import datetime
import string
import zipfile
import flask
from flask import json
from SQLQuery import * 
from SQLEdit import *
from Main import execuleSqlEdit, executeSqlQuery, justExeSqlQuery
all=flask.Blueprint('all', __name__)


@all.route('/account/check', methods=['GET'])
def checkAccount():
    UserName =flask.request.json.get('UserName',"")
    PassWord = flask.request.json.get('PassWord',"")
    isrequireadmin=flask.request.args.get('isrequireadmin',"")
    return executeSqlQuery(SQLCHECKACCOUNT,PassWord,f"%{isrequireadmin}%",UserName)
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
@all.route('/submissions/<subid>', methods=['GET'])
def getSubmitssion(subid=""):
    idp=flask.request.args.get('idprob',"")
    un=flask.request.args.get('un',"")
    subs=flask.request.args.get('substate',"")
    lg=flask.request.args.get('sublg',"")
    # name=dif=type=""
    return executeSqlQuery(SQLGETSUBMITSSIONS+CONGETASUB,f"%{un}%",f"%{subs}%",f"%{idp}%",f"%{lg}%",subid)


@all.route('/rank', methods=['GET'])
def getRanking():
    return executeSqlQuery(SQLGETRANKING)

@all.route('/submissions/state', methods=['GET'])
def getAllState():
    return executeSqlQuery(SQLGETALLSTATE)

# @all.route('/testfile', methods=['GET'])
# def getAllTestFile():
#     return executeSqlQuery(SQLGETALLTESTFILE)


#route edit #############################################################################
@all.route('/problems',methods=['post'])
def addProblem():
    name =flask.request.json.get('ProblemName',"")
    id = flask.request.json.get('ProblemId',"")
    idt=flask.request.json.get('ProblemTypeId',"")
    p=flask.request.json.get('Point',"")
    des=flask.request.json.get('Decribe',"")
    TimeLimit=flask.request.json.get('TimeLimit',"")
    MemoryLimit=flask.request.json.get('MemoryLimit',"")
    isActive=1
    if len(justExeSqlQuery(SQLGETPROBLEM,id))>0: 
        # TODO: đã tồn tại id problem
        return flask.jsonify({"mess":"đã tồn tại id problem"}) 
    if id=='' or idt=='' or not isinstance(p,int) or name=='' or TimeLimit=="" or MemoryLimit=="":
        # TODO: có 1 cái not null bị null
        return flask.jsonify({"mess":"có 1 cái not null bị null"})
    if len(justExeSqlQuery(SQLGETPROBLEMTYPEBYID,idt))==0: 
        # TODO: không tồn tại kiểu bt này
        return flask.jsonify({"mess":"không tồn tại kiểu bt này"})
    return execuleSqlEdit(SQLINSPROBLEM,name,id,idt,p,des,TimeLimit,MemoryLimit,isActive)
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
    SubmissionTime = datetime.datetime.now().strftime("20%y-%m-%d %H:%M:%S")
    LanguageName=flask.request.json.get('LanguageName',"")
    TheAnswer=flask.request.json.get('TheAnswer',"")
    
    # gán dữ liệu là chưa được chấm
    Point='-1'
    SubStatus="P"
    TotalTime=Memory="-1"
    
    
    
    isActive=1
    if ProblemInContestId=='' or UserName=='' or LanguageName=='' or\
        TheAnswer=='':
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
    
    
    return execuleSqlEdit(SQLADDSUBMISSION,ProblemInContestId,UserName,SubmissionTime,LanguageName,
                          TheAnswer,Memory,TotalTime,SubStatus,Point,isActive)


# @all.route('/testfile',methods=['post'])
# def addTestcaseFile():
#     ProblemId=flask.request.json.get('ProblemId',"")
#     FileZip=flask.request.files.get('attachment')
#     # return FileZip
#     if len(justExeSqlQuery(SQLGETPROBLEM,ProblemId))==0 :
#         # TODO: id problem k tồn tại
#         return flask.jsonify({"mess":'id problem không tồn tại'})
#     return execuleSqlEdit(SQLADDTESTCASEFILE,ProblemId,FileZip)

@all.route('/testfile', methods = ['POST'])   
def addTestcaseFile():  
    ProblemId = flask.request.form.get('ProblemId')
    FileZip = flask.request.files.get('file')
    NumberTestcase=flask.request.form.get('NumberTestcase')
    if len(justExeSqlQuery(SQLGETPROBLEM,ProblemId))==0 :
        # TODO: id problem k tồn tại
        return flask.jsonify({"mess":'id problem không tồn tại'})
    NumberTestcase=int(NumberTestcase)
    ck=[0]*(NumberTestcase+10)
    file_list = FileZip.name
    with zipfile.ZipFile(FileZip, 'r') as zip_ref:
        # Lấy danh sách các tệp tin và thư mục trong thư mục
        file_list = zip_ref.namelist()
    for file_name in file_list:
        if file_name.startswith('in') and file_name.endswith('.txt'):
            ck[int(file_name[2:-4])]+=1
        elif file_name.startswith('out') and file_name.endswith('.txt'):
            ck[int(file_name[3:-4])]-=1
    if any(element != 0 for element in ck):
        return flask.jsonify({"mess":'số file in và file out không khớp với nhau',
                              "files_name":file_list,
                              'num':NumberTestcase})
        
    if len(file_list)/2!=NumberTestcase:
        # TODO: id problem k tồn tại
        return flask.jsonify({"mess":'số file in và file out không phải từ 1 đến number testcase',
                              "files_name":file_list,
                              'num':NumberTestcase})
    try:
        justExeSqlQuery(SQLDELOLDFILEZIP,ProblemId)
    except Exception as e:
        print("lỗi ",e)
    FileZip.stream.seek(0)
    return execuleSqlEdit(SQLADDTESTCASEFILE,ProblemId,FileZip.stream.read(),NumberTestcase)

from Main import executeGetFileZip
@all.route('/testfile', methods = ['get'])   
def getTestcaseFile():
    return executeGetFileZip('pb1')

