import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import PageList from "../../component/PageList";
const langDemo = [
    { id: 'all', name: 'Tất cả' },
    { id: 'cpp', name: 'C++ 11' },
    { id: 'java', name: 'Java 17' },
    { id: 'py', name: 'Python 3' },
]
const statusDemo = [
    { id: 'all', name: 'Tất cả' },
    { id: 'AC', name: 'AC' },
    { id: 'WA', name: 'WA' },
    { id: 'TLE', name: 'TLE' },
]

export default function SubmissionList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [submitData, setSubmitData] = useState(null);
    const [curPage, setCurPage] = useState(1);
    const [maxPage, setMaxPage] = useState(0);
    const numPerPage = 10;
    let [filterProblemId, setFilterProblemId] = useState(null);
    let [filterUsername, setFilterUsername] = useState(null);
    let [filterLang, setFilterLang] = useState(0);
    let [filterStatus, setfilterStatus] = useState(0);
    function filterSubmitHandle(event) {
        event.preventDefault();
        let param = {}
        let problemId = filterProblemId;
        let username = filterUsername;
        let lang = filterLang;
        let status = filterStatus;
        if (problemId != null) param['problemId'] = problemId
        if (username != null) param['username'] = username
        if (lang != 0) param['lang'] = lang
        if (status !== 0) param['status'] = status
        setSearchParams(param);
    }
    useState(() => {
        if (searchParams.has('problemId')) {
            setFilterProblemId(searchParams.get('problemId'))
        };
        if (searchParams.has('username')) {
            setFilterUsername(searchParams.get('username'))
        };
        if (searchParams.has('lang')) {
            setFilterLang(searchParams.get('lang'))
        };
        if (searchParams.has('status')) {
            setfilterStatus(searchParams.get('status'))
        };
    }, [searchParams])
    useEffect(() => {
        setSubmitData(null);

        setTimeout(() => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            var url = new URL("http://127.0.0.1:5000/submissions");
            if (filterProblemId != null && filterProblemId !== '') url.searchParams.set('idprob', filterProblemId);
            if (filterUsername != null && filterUsername !== '') url.searchParams.set('un', filterUsername);
            if (filterLang != 0) url.searchParams.set('sublg', langDemo[filterLang].id);
            if (filterStatus != 0) url.searchParams.set('substate', statusDemo[filterStatus].id);

            fetch(url, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    let data = JSON.parse(result)
                    console.log(data)
                    setSubmitData(data);
                    if (data == null) return;
                    let temp = Math.floor((data.length - 1) / numPerPage) + 1;
                    if (temp !== maxPage) setMaxPage(temp);

                })
                .catch((error) => {
                    setSubmitData('[]');
                    console.error(error)
                })
        }, 1000)
    }, [searchParams]);
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            <div className="ivu-col ivu-col-span-24" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ">
                    <div className="ivu-card-head">
                        <div className="panel-title d-flex justify-content-between align-items-center">
                            <h2>
                                Danh sách bài nộp
                            </h2>
                            <div className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#filterDialog">
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
                                <RowList data={submitData} numPerPage={numPerPage} curPage={curPage} maxPage={maxPage} setMaxPage={setMaxPage} />
                            </tbody>
                        </table>
                        <PageList curPage={curPage} maxPage={maxPage} setCurPage={setCurPage} />
                    </div>
                </div>
            </div>
            <FormFilter filterLang={filterLang} setFilterLang={setFilterLang} filterStatus={filterStatus} setfilterStatus={setfilterStatus} filterSubmitHandle={filterSubmitHandle} />
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
            <th className="col-1"></th>
        </tr>
    );
}
function RowList({ data, curPage, maxPage, setMaxPage, numPerPage }) {
    if (numPerPage === 0 || numPerPage == null) numPerPage = 10;
    const rowList = [];
    if (data == null) {
        for (let i = 0; i < numPerPage; i++)
            rowList.push(<LoadingRow />)
    } else {
        for (let i = (curPage - 1) * numPerPage; i < curPage * numPerPage && i < data.length; i++) {
            let element = data[i];

            rowList.push(<ProblemRow
                key={element['SubmissionId']}
                problemid={element['ProblemId']}
                name={element['ProblemName']}
                status={element['SubStatus']}
                dateSubmit={element['DateSub']}
                lang={element['LanguageName']}
                timeAndMemory={element['RunTime'] + " - " + element['Memory']}
                point={element['Point']}
                username={element['UserName']}
                fullName={element['FullName']}
                submitId={element['SubmissionId']}
            />);
        }
    }
    if (rowList.length === 0) rowList.push(<NoDataRow />)
    return rowList;
}
function ProblemRow({ problemid, name, status, dateSubmit, lang, timeAndMemory, point, username, fullName, submitId }) {
    return (
        <tr>
            <td >
                <Link to={'/problem/' + problemid}>
                    <button type="button" className="btn btn-problem p-0">
                        {name}
                    </button>
                </Link>
            </td>
            <td className="text-center"><StatusBadge status={status} /></td>
            <td className="text-center">{dateSubmit}</td>
            <td className="text-center">{lang}</td>
            <td className="text-center">{timeAndMemory}</td>
            <td className="text-center">{point}</td>
            <td className="text-center">
                <Link to={'/user/' + username}>
                    <button type="button" className="btn btn-problem p-0">
                        {fullName}
                    </button>
                </Link>
            </td>
            <td className="text-center">
                <Link to={'/problem/' + submitId}>
                    <button type="button" className="btn p-0">
                        Xem
                    </button>
                </Link>
            </td>
        </tr>
    )
}
function NoDataRow() {
    return (
        <tr>
            <td colSpan='8' className="text-center">
                Không có bài tập
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
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-6"></span></td>
        </tr>
    )
}
function StatusBadge({ status }) {
    let className;
    if (status == 'AC') className = 'text-bg-success'
    else if (status == 'WA') className = 'text-bg-danger'
    else className = 'text-bg-warning'
    return (
        <div className={"ivu-tag ivu-tag-checked " + className + " rounded fw-bold text-white"}>
            {status}
        </div>
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
function FormFilter({ filterLang, setFilterLang, filterStatus, setfilterStatus, filterSubmitHandle }) {
    return (
        <div className="modal fade" id="filterDialog" tabIndex="-1" aria-labelledby="filterLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="filterLabel">Lọc kết quả</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={filterSubmitHandle}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <input type="hidden" name="lang" />
                                    <label className="form-label">Trạng thái: </label>
                                    <div className="dropdown btn-group col-12">
                                        <button type="button" className="btn btn-outline-primary">
                                            {statusDemo[filterStatus].name}
                                        </button>
                                        <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split flex-grow-0" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <LangButton index={0} lang={statusDemo[0]} setLang={setfilterStatus} />
                                            <LangButton index={1} lang={statusDemo[1]} setLang={setfilterStatus} />
                                            <LangButton index={2} lang={statusDemo[2]} setLang={setfilterStatus} />
                                            <LangButton index={3} lang={statusDemo[3]} setLang={setfilterStatus} />
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <input type="hidden" name="lang" />
                                    <label className="form-label">Ngôn ngữ: </label>
                                    <div className="dropdown btn-group col-12">
                                        <button type="button" className="btn btn-outline-primary">
                                            {langDemo[filterLang].name}
                                        </button>
                                        <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split flex-grow-0" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            <LangButton index={0} lang={langDemo[0]} setLang={setFilterLang} />
                                            <LangButton index={1} lang={langDemo[1]} setLang={setFilterLang} />
                                            <LangButton index={2} lang={langDemo[2]} setLang={setFilterLang} />
                                            <LangButton index={3} lang={langDemo[3]} setLang={setFilterLang} />
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div>
                                <button type="button" className="btn btn-secondary me-1" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Lọc</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
function LangButton({ index, lang, setLang }) {
    return (
        <li><button type="button" className="dropdown-item" onClick={() => setLang(index)}>{lang.name}</button></li>
    )

}