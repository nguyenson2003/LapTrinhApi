import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';

export default function SubmissionList() {
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
            fetch("http://127.0.0.1:5000/submissions", requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    let data = JSON.parse(result)
                    console.log(data)
                    setRes(result);

                })
                .catch((error) => {
                    setRes('[]');
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
            <div className="ivu-col ivu-col-span-24" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ">
                    <div className="ivu-card-head">
                        <div className="panel-title d-flex justify-content-between align-items-center">
                            <h2>
                                Danh sách bài nộp
                            </h2>
                            <div className="btn btn-primary">
                                Lọc kết quả
                            </div>
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
            {/* <div className="ivu-col ivu-col-span-6" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head">
                        <h3>Tìm kiếm bài tập</h3>
                    </div>
                    <div className="ivu-card-body">
                        <form onSubmit={filterSubmitHandle}>
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
                            <div className="d-grid gap-2 mt-3">
                                <button className="btn btn-primary btn-submit" type="submit">
                                    Tìm kiếm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
function HeadRow() {
    return (
        <tr className="table-light table-row text-center">
            <th className="col-2">Tên bài tập</th>
            <th className="col-1">Trạng thái</th>
            <th className="col-1">Ngày nộp</th>
            <th className="col-1">Ngôn ngữ</th>
            <th className="col-2">Thời gian, bộ nhớ</th>
            <th className="col-1">Điểm bài nộp</th>
            <th className="col-1">Người nộp</th>
        </tr>
    );
}
function RowList({ result, curPage, maxPage, setMaxPage, numPerPage }) {
    if (numPerPage === 0 || numPerPage == null) numPerPage = 10;
    const rowList = [];
    if (result == null) {
        for (let i = 0; i < numPerPage; i++)
            rowList.push(<LoadingRow />)
    } else {
        result = JSON.parse(result);
        for (let i = (curPage - 1) * numPerPage; i < curPage * numPerPage && i < result.length; i++) {
            let element = result[i];

            rowList.push(<ProblemRow
                key={element['ProblemId']}
                id={element['ProblemId']}
                name={element['ProblemName']}
                status={element['SubStatus']}
                dateSubmit={element['SubmissionTime']}
                lang={element['LanguageName']}
                timeAndMemory={element['TotalTime'] + " - " + element['Memory']}
                point={element['Point']}
                username={element['UserName']}
            />);
        }
    }
    if (rowList.length === 0) rowList.push(<NoDataRow />)
    return rowList;
}
function ProblemRow({ id, name, status, dateSubmit, lang, timeAndMemory, point, username }) {
    return (
        <tr>
            <td >
                <Link to={'/problem/' + id}>
                    <button type="button" className="btn btn-problem p-0">
                        {name}
                    </button>
                </Link>
            </td>
            <td className="text-center"><StatusBadge status={status}/></td>
            <td className="text-center">{dateSubmit}</td>
            <td className="text-center">{lang}</td>
            <td className="text-center">{timeAndMemory}</td>
            <td className="text-center">{point}</td>
            <td className="text-center">{username}</td>
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
            <td className="placeholder-wave placeholder-glow"><span className={"placeholder col-" + parseInt(Math.random() * 5 + 8)}></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-6"></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-12"></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-6"></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-6"></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-5"></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-10"></span></td>
        </tr>
    )
}
function StatusBadge({ status }) {
    let className;
    if (status == 'AC') className = 'text-bg-success'
    else if (status == 'WA') className = 'text-bg-danger'
    else className = 'text-bg-warning'
    return (
        <div className={"ivu-tag ivu-tag-checked "+className+" rounded fw-bold text-white"}>
            {status}
        </div>
    )
}
function PageList({ curPage, maxPage, setCurPage }) {
    const compList = [];
    for (let i = 1; i <= maxPage; i++) {
        compList.push(<PageButton
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
                <PageButton curPage={curPage} setCurPage={setCurPage} maxPage={maxPage} numThisPage={curPage - 1} text="&lt;" />
                {compList}
                <PageButton curPage={curPage} setCurPage={setCurPage} maxPage={maxPage} numThisPage={curPage + 1} text="&gt;" />
                {/* <li title="Trang tiếp theo" className="ivu-page-next">
                    <a>
                        <i className="ivu-icon ivu-icon-ios-arrow-right">&gt;</i>
                    </a>
                </li> */}
            </ul>
        </div>
    )
}
function PageButton({ curPage, setCurPage, maxPage, numThisPage, text }) {
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
