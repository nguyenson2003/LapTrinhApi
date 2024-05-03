import "./ProblemList.css";
import { useState } from 'react';

export default function ProblemList() {
    const [res,setRes] = useState(null);
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://127.0.0.1:5000/problem/getall", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            setRes(result);
        })
        .catch((error) => {
            console.error(error)
        });
    // console.log(1);
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            <div className="ivu-col ivu-col-span-18" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ">
                    <div className="ivu-card-head">
                        <div className="panel-title">
                                <h2>
                                    Danh sách vấn đề
                                </h2>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <PageList />
                        <table cellSpacing="0" cellPadding="0" border="1" className="table table-hover transitions align-middle m-0 mt-2 mb-2" >
                            <thead>
                                <tr className="table-light">
                                    <th>#</th>
                                    <th>Tiêu đề</th>
                                    <th>Mức độ</th>
                                    <th>Tổng cộng</th>
                                    <th>Tỷ lệ AC</th>
                                </tr>
                            </thead>
                            <tbody className="ivu-table-tbody">
                                {/* <ProblemRow id='1' name='Hello World!' difficult='Trung bình' totalSubmit="8123" percentSubmit="75.31%" />
                                <ProblemRow /> */}
                                <RowList result={res}/>
                            </tbody>
                        </table>

                        <PageList />
                    </div>
                </div>
            </div>
            <div className="ivu-col ivu-col-span-6" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head">
                        <div className="panel-title">
                            <div className="taglist-title">
                                <font>
                                    <h3>Tìm kiếm bài tập</h3>
                                </font>
                            </div>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <label className="label-form" htmlFor="nameProblem">Tên đề bài</label>
                        <input type="problemName" className="form-control " id="nameProblem" placeholder="Ví dụ: Hello World!" />
                        <div className="mt-2 row">
                            <label className="form-label col-12">Kiểu bài tập:</label>
                            <div className="dropdown btn-group">
                                <button type="button" className="btn btn-outline-primary">
                                    Tất cả
                                </button>
                                <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split flex-grow-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <form className="dropdown-menu p-4 dropdown-menu-lg-end">

                                </form>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="form-label">Độ khó:</label>
                            <ul className="p-0">
                                <li className="col me-1 btn btn-outline-success">Dễ</li>
                                <li className="col me-1 btn btn-outline-warning btn-mid">Trung bình</li>
                                <li className="col me-1 btn btn-outline-danger">Khó</li>
                            </ul>
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button className="btn btn-primary btn-submit" type="submit">
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function RowList({result}) {
    if(result==null)return <NoDataRow/>
    const rowList = [];
    console.log(result);
    result=JSON.parse(result);
    result.forEach(element => {
        rowList.push(<ProblemRow 
            id={element['ProblemId']}
            name={element['ProblemName']}
            difficult='Trung bình'
            totalSubmit={123}
            percentSubmit='69.96%'
        />);
    });
    return rowList;
}
function ProblemRow({ id, name, difficult, totalSubmit, percentSubmit }) {
    return (
        <tr>
            <td>
                <button type="button" className="btn btn-problem p-0">
                    {id}
                </button>
            </td>
            <td>
                <button type="button" className="btn btn-problem p-0">
                    {name}
                </button>
            </td>
            <td>
                <div className="ivu-tag ivu-tag-checked text-bg-warning rounded bold  text-white">
                    {difficult}
                </div>
            </td>
            <td>{totalSubmit}</td>
            <td>{percentSubmit}</td>
        </tr>
    )
}
function NoDataRow() {
    return (
        <tr>
            <td colSpan='5' className="text-center">
                Không có bài tập
            </td>
        </tr>
    )
}
function LoadingRow() {

}
function PageList() {
    return (
        <div className="page">
            <ul className="ivu-page p-0 m-0">
                <li title="Trang trước" className="ivu-page-prev ivu-page-disabled"><a>
                    <i className="ivu-icon ivu-icon-ios-arrow-left">&lt;</i></a></li>
                <li title="1" className="ivu-page-item ivu-page-item-active"><a>
                    <font>1</font>
                </a></li>
                <li title="2" className="ivu-page-item"><a>
                    <font>2</font>
                </a></li>
                <li title="3" className="ivu-page-item"><a>
                    <font>3</font>
                </a></li>
                <li title="5 trang tiếp theo" className="ivu-page-item-jump-next"><a><i
                    className="ivu-icon ivu-icon-ios-arrow-right"></i></a></li>
                <li title="43" className="ivu-page-item"><a>
                    <font>43</font>
                </a></li>
                <li title="Trang tiếp theo" className="ivu-page-next">
                    <a>
                        <i className="ivu-icon ivu-icon-ios-arrow-right">&gt;</i>
                    </a>
                </li>
            </ul>
        </div>
    )
}