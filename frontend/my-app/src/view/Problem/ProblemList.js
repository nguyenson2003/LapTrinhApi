import { Link, useSearchParams } from "react-router-dom";
import "./ProblemList.css";
import { useState, useEffect } from 'react';
import PageList from "../../component/PageList";

export default function ProblemList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [problemData, setProblemData] = useState(null);
    const [tagData, setTagData] = useState([]);
    const [curPage, setCurPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
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
    useState(() => {
        if (searchParams.has('nameProblem')) {
            setFilterName(searchParams.get('nameProblem'))
        };
        if (searchParams.has('tag')) {
            let tag = (searchParams.get('tag'))
            tagData.forEach(e => { if (e.id == tag.id) setFilterTag(e) })
        };
        if (searchParams.has('difficult')) {
            setFilterDifficult(searchParams.get('difficult'))
        };
    }, [searchParams])
    useEffect(() => {
        setProblemData(null);
        setTimeout(() => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            var url = new URL("http://127.0.0.1:5000/problems");
            if (filterName != null && filterName !== '') url.searchParams.set('name', filterName);
            if (filterTag != null) url.searchParams.set('type', filterTag.id);
            if (filterDifficult != null && filterDifficult !== 0) url.searchParams.set('dif', filterDifficult);
            fetch(url, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    let data = JSON.parse(result);
                    setProblemData(data);
                    if (data == null) return;
                    let temp = Math.floor((data.length - 1) / numPerPage) + 1;
                    setMaxPage(Math.max(1,temp));
                })
                .catch((error) => {
                    setProblemData('[]');
                    setMaxPage(1);
                    console.error(error)
                })
        }, 1000)
    }, [searchParams]);
    useEffect(() => {
        setTimeout(() => {
            setTagData(tagDemo);
            //         const requestOptions = {
            //             method: "GET",
            //             redirect: "follow"
            //         };
            //         var url = new URL("http://127.0.0.1:5000/typeprob");
            //         fetch(url, requestOptions)
            //             .then((response) => response.text())
            //             .then((result) => {
            //                 let temp = JSON.parse(result);
            //                 setTagData(temp);
            //             })
            //             .catch((error) => {
            //                 setTagData('[]');
            //                 console.error(error)
            //             })
        }, 1000)
    }, []);
    return (
        <div className="ivu-row">
            {/* <LoadParam setFilterName={setFilterName} tags={tagData} setFilterTag={setFilterTag} setFilterDifficult={setFilterDifficult} searchParams={searchParams} /> */}
            <div className="ivu-col ivu-col-span-18 pe-3">
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
                                <RowList data={problemData} numPerPage={numPerPage} curPage={curPage} maxPage={maxPage} setMaxPage={setMaxPage} />
                            </tbody>
                        </table>
                        <PageList curPage={curPage} maxPage={maxPage} setCurPage={setCurPage} />
                    </div>
                </div>
            </div>
            <div className="ivu-col ivu-col-span-6 ">
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head">
                        <h3>Tìm kiếm bài tập</h3>
                    </div>
                    <div className="ivu-card-body">
                        <form onSubmit={filterSubmitHandle}>
                            <label className="form-label" htmlFor="nameProblem">Tên đề bài</label>
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
                                            <TagList tags={tagData} filterTagSearch={filterTagSearch} setFilterTag={setFilterTag} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <label className="form-label">Độ khó:</label>
                                <ul className="p-0">
                                    <input type="hidden" name="difficult" value={filterDifficult} />
                                    <DifficultButton difficult={1} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                    <DifficultButton difficult={2} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                    <DifficultButton difficult={3} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
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
function HeadRow() {
    return (
        <tr className="table-light table-row">
            <th className="col-1">#</th>
            <th className="col-4">Tiêu đề</th>
            <th className="col-2">Mức độ</th>
            <th className="col-2">Số bài nộp</th>
            <th className="col-2">Tỷ lệ AC</th>
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
                key={element['ProblemId']}
                id={element['ProblemId']}
                name={element['ProblemName']}
                difficult={element['Point']}
                totalSubmit={element['TotalSubmit']}
                percentSubmit={element['RateAC']}
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
                <DifficultBadge difficult={difficult} />
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
                    <span class={"placeholder col-" + parseInt(Math.random() * 6 + 7)}></span>
                </p>
            </td>
            <td>
                <p aria-hidden="true" className="placeholder-glow placeholder-wave p-0 m-0 mb-1">
                    <span class={"placeholder col-" + parseInt(Math.random() * 6 + 1)}></span>
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
function DifficultButton({ difficult, curDifficult, setFilterDifficult }) {
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
function DifficultBadge({ difficult }) {
    let component;
    if (difficult == 1)
        component = <div className="ivu-tag ivu-tag-checked text-bg-success rounded fw-bold text-white">
            Dễ
        </div>
    if (difficult == 2)
        component = <div className="ivu-tag ivu-tag-checked text-bg-warning rounded fw-bold text-white">
            Trung bình
        </div>
    if (difficult == 3)
        component = <div className="ivu-tag ivu-tag-checked text-bg-danger rounded fw-bold text-white">
            Khó
        </div>
    return component
}