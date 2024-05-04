import "./ProblemList.css";
import { useState } from 'react';

export default function ProblemList() {
    const [res, setRes] = useState(null);
    const [curPage, setCurPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://127.0.0.1:5000/Problems", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            setRes(result);
        })
        .catch((error) => {
            setRes(null);
            console.error(error)
        });
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
                        <PageList curPage={curPage} maxPage={maxPage} setCurPage={setCurPage} />
                        <table cellSpacing="0" cellPadding="0" border="1" className="table table-hover transitions align-middle m-0 mt-2 mb-2" >
                            <thead>
                                <HeadRow />
                            </thead>
                            <tbody className="ivu-table-tbody">
                                <RowList result={res} curPage={curPage} maxPage={maxPage} setMaxPage={setMaxPage} />
                            </tbody>
                        </table>
                        <PageList curPage={curPage} maxPage={maxPage} setCurPage={setCurPage} />
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
function HeadRow() {
    return (
        <tr className="table-light">
            <th>#</th>
            <th>Tiêu đề</th>
            <th>Mức độ</th>
            <th>Tổng cộng</th>
            <th>Tỷ lệ AC</th>
        </tr>
    );
}
function RowList({ result, curPage, maxPage, setMaxPage, numPerPage }) {
    if (numPerPage == 0 || numPerPage == null) numPerPage = 10;
    if (result == null) return <NoDataRow />
    const rowList = [];
    result = JSON.parse(result);
    for (let i = (curPage - 1) * numPerPage; i < curPage * numPerPage && i < result.length; i++) {
        let element = result[i];
        rowList.push(<ProblemRow
            id={element['ProblemId']}
            name={element['ProblemName']}
            difficult='Trung bình'
            totalSubmit={123}
            percentSubmit='69.96%'
        />);
    }
    let temp = Math.floor((result.length - 1) / numPerPage) + 1;
    if (temp != maxPage) setMaxPage(temp);
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
function NoDataRow({ text }) {
    if (text == null) text = "Không có bài tập"
    return (
        <tr>
            <td colSpan='5' className="text-center">
                {text}
            </td>
        </tr>
    )
}
function LoadingRow() {

}
function PageList({ curPage, maxPage, setCurPage }) {
    const compList = [];
    for (let i = 1; i <= maxPage; i++) {
        compList.push(<BtnPage
            curPage={curPage}
            setCurPage={setCurPage}
            numThisPage={i}
            maxPage={maxPage}
        />)
    }
    return (
        <div className="page">
            <ul className="ivu-page p-0 m-0">
                <BtnPage curPage={curPage} setCurPage={setCurPage} maxPage={maxPage} numThisPage={curPage - 1} text="&lt;" />
                {compList}
                <BtnPage curPage={curPage} setCurPage={setCurPage} maxPage={maxPage} numThisPage={curPage + 1} text="&gt;" />
                {/* <li title="Trang tiếp theo" className="ivu-page-next">
                    <a>
                        <i className="ivu-icon ivu-icon-ios-arrow-right">&gt;</i>
                    </a>
                </li> */}
            </ul>
        </div>
    )
}
function BtnPage({ curPage, setCurPage, maxPage, numThisPage, text }) {
    if (text == null) text = numThisPage;
    return (
        <li className="ivu-page-item border-0">
            <button
                className={
                    "btn btn-outline-primary m-0 p-0 w-100 h-100"
                    + (numThisPage < 1 || numThisPage > maxPage ? " disabled" : "")
                    + (numThisPage == curPage ? " active" : "")
                }
                onClick={() => setCurPage(numThisPage)}
            >
                <font>{text}</font>
            </button>
        </li>
    )
}