import { Link, useSearchParams } from "react-router-dom";
import "./ProblemList.css";
import { useState, useEffect } from 'react';

export default function ProblemList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [res, setRes] = useState(null);
    const [curPage, setCurPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const [filterTagSearch, setFilterTagSearch] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterTag, setFilterTag] = useState(null);
    const [filterDifficult, setFilterDifficult] = useState(0);
    const numPerPage = 10;
    const tagDemo = [
        { id: 1, name: 'Adhoc' },
        { id: 2, name: 'Quay lui' },
        { id: 3, name: 'Xử lý chuỗi' },
        { id: 4, name: 'Quy hoạch động' },
    ]
    function filterSubmitHandle(event) {
        event.preventDefault();
        let param = {}
        let nameProblem = filterName;
        let tag = filterTag;
        let difficult = filterDifficult;
        if (nameProblem !== '') param['nameProblem'] = nameProblem
        if (tag != null) param['tag'] = tag.id
        if (difficult !== 0) param['difficult'] = difficult
        setSearchParams(param);
    }
    useEffect(() => {
        if (searchParams.has('nameProblem')) {
            setFilterName(searchParams.get('nameProblem'))
            // searchParams.delete('nameProblem');
        };
        if (searchParams.has('tag')) {
            let tag = (searchParams.get('tag'))
            tagDemo.forEach(e => { if (e.id == tag.id) setFilterTag(e) })
            // searchParams.delete('tag');
        };
        if (searchParams.has('difficult')) {
            setFilterDifficult(searchParams.get('difficult'))
            // searchParams.delete('difficult');
        };
    }, [searchParams])
    useEffect(() => {
        setTimeout(() => {
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
                })
        }, 1000)
    }, [searchParams]);
    useEffect(() => {
        if (res == null) return;
        let data = JSON.parse(res);
        let temp = Math.floor((data.length - 1) / numPerPage) + 1;
        if (temp !== maxPage) setMaxPage(temp);
    }, [res])
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            {/* <LoadParam setFilterName={setFilterName} tags={tagDemo} setFilterTag={setFilterTag} setFilterDifficult={setFilterDifficult} searchParams={searchParams} /> */}
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
                                <RowList result={res} numPerPage={numPerPage} curPage={curPage} maxPage={maxPage} setMaxPage={setMaxPage} />
                            </tbody>
                        </table>
                        <PageList curPage={curPage} maxPage={maxPage} setCurPage={setCurPage} />
                    </div>
                </div>
            </div>
            <div className="ivu-col ivu-col-span-6" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head">
                        <h3>Tìm kiếm bài tập</h3>
                    </div>
                    <div className="ivu-card-body">
                        <form onSubmit={filterSubmitHandle}>
                            <label className="label-form" htmlFor="nameProblem">Tên đề bài</label>
                            <input onChange={(e) => setFilterName(e.target.value)} type="text" className="form-control " id="nameProblem" name="nameProblem" placeholder="Ví dụ: Hello World!" value={filterName} />
                            <div className="mt-2 row">
                                <input type="hidden" value={filterTag === null ? 0 : filterTag.id} name="tag" />
                                <label className="form-label col-12">Kiểu bài tập:</label>
                                <div className="dropdown btn-group">
                                    <button type="button" className="btn btn-outline-primary">
                                        {filterTag === null ? "Tất cả" : filterTag.name}
                                    </button>
                                    <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split flex-grow-0" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="visually-hidden">Toggle Dropdown</span>
                                    </button>
                                    <div className="dropdown-menu p-4 dropdown-menu-lg-end" style={{ width: '300px' }}>
                                        <div className="mb-3">
                                            <input type="text" className="form-control" id="tagFind" placeholder="Tìm loại đề bài" onChange={(e) => setFilterTagSearch(e.target.value)} />
                                            <button type="button" onClick={() => setFilterTag(null)} className="btn p-0 m-0 link-primary text-decoration-underline">tất cả</button>
                                        </div>
                                        <div className="d-flex flex-wrap">
                                            <TagList tags={tagDemo} filterTagSearch={filterTagSearch} setFilterTag={setFilterTag} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <label className="form-label">Độ khó:</label>
                                <ul className="p-0">
                                    <input type="hidden" name="difficult" value={filterDifficult} />
                                    <BtnDifficult difficult={1} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                    <BtnDifficult difficult={2} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                    <BtnDifficult difficult={3} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                </ul>
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <button className="btn btn-primary btn-submit" type="submit">
                                    Tìm kiếm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
function LoadParam({ setFilterName, tags, setFilterTag, setFilterDifficult, searchParams }) {

    return <div style={{ display: 'none' }}></div>
}
function HeadRow() {
    return (
        <tr className="table-light table-row">
            <th className="col-1">#</th>
            <th className="col-4">Tiêu đề</th>
            <th className="col-2">Mức độ</th>
            <th className="col-2">Tổng cộng</th>
            <th className="col-2">Tỷ lệ AC</th>
        </tr>
    );
}
function RowList({ result, curPage, maxPage, setMaxPage, numPerPage }) {
    if (numPerPage === 0 || numPerPage == null) numPerPage = 10;
    const rowList = [];
    if (result == null) {
        for(let i=0;i<numPerPage;i++)
            rowList.push(<LoadingRow />)
    }    else {
        result = JSON.parse(result);
        for (let i = (curPage - 1) * numPerPage; i < curPage * numPerPage && i < result.length; i++) {
            let element = result[i];
            rowList.push(<ProblemRow
                key={element['ProblemId']}
                id={element['ProblemId']}
                name={element['ProblemName']}
                difficult='Trung bình'
                totalSubmit={123}
                percentSubmit='69.96%'
            />);
        }
    }
    if (rowList.length === 0) rowList.push(<NoDataRow />)
    return rowList;
}
function ProblemRow({ id, name, difficult, totalSubmit, percentSubmit }) {
    return (
        <tr>
            <td>
                <Link to={'/problem/' + id}>
                    <button type="button" className="btn btn-problem p-0">
                        {id}
                    </button>
                </Link>
            </td>
            <td>
                <Link to={'/problem/' + id}>
                    <button type="button" className="btn btn-problem p-0">
                        {name}
                    </button>
                </Link>
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
    return (
        <tr>
            <td>
                <p aria-hidden="true" className="placeholder-glow placeholder-wave p-0 m-0 mb-1">
                    <span class="placeholder col-6"></span>
                </p>

            </td>
            <td>
                <p aria-hidden="true" className="placeholder-glow placeholder-wave p-0 m-0 mb-1">
                    <span class={"placeholder col-"+parseInt(Math.random()*6+7)}></span>
                </p>
            </td>
            <td>
                <p aria-hidden="true" className="placeholder-glow placeholder-wave p-0 m-0 mb-1">
                    <span class={"placeholder col-"+parseInt(Math.random()*6+1)}></span>
                </p>

            </td>
            <td>
                <p aria-hidden="true" className="placeholder-glow placeholder-wave p-0 m-0 mb-1">
                    <span class="placeholder col-3"></span>
                </p>
            </td>
            <td>
                <p aria-hidden="true" className="placeholder-glow placeholder-wave p-0 m-0 mb-1">
                    <span class="placeholder col-3"></span>
                </p>
            </td>
        </tr>
    )
}
function PageList({ curPage, maxPage, setCurPage }) {
    const compList = [];
    for (let i = 1; i <= maxPage; i++) {
        compList.push(<BtnPage
            key={i}
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
                    + (numThisPage === curPage ? " active" : "")
                }
                onClick={() => setCurPage(numThisPage)}
            >
                <font>{text}</font>
            </button>
        </li>
    )
}
function BtnDifficult({ difficult, curDifficult, setFilterDifficult }) {
    let className, text;
    if (difficult == 1) { className = ' btn-outline-success'; text = 'Dễ'; }
    if (difficult == 2) { className = ' btn-outline-warning btn-mid'; text = 'Trung bình'; }
    if (difficult == 3) { className = ' btn-outline-danger'; text = 'Khó'; }
    if (difficult == curDifficult) className += ' active';
    function setDiff() {
        if (curDifficult == difficult) setFilterDifficult(0);
        else setFilterDifficult(difficult)
    }
    return (
        <li className="col d-inline-block me-1">
            <button type="button" className={"btn" + className} onClick={setDiff}>
                {text}
            </button>
        </li>
    )
}
function TagList({ tags, filterTagSearch, setFilterTag }) {
    const item = [];
    tags.forEach((tag) => {
        if (tag.name.toLowerCase().indexOf(filterTagSearch.toLowerCase()) === -1) {
            return;
        }
        item.push(
            <TagButton key={tag.id} tag={tag} setFilterTag={setFilterTag} />
        );
    });
    return item;
}
function TagButton({ tag, setFilterTag }) {
    return (
        <button type="button" className="btn btn-secondary btn-sm m-1 flex-grow-1" onClick={() => setFilterTag(tag)}>
            {tag.name}
        </button>
    )
}