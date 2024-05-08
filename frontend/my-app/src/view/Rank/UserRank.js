import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import PageList from "../../component/PageList";

export default function UserRank() {
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
            fetch("http://127.0.0.1:5000/rank", requestOptions)
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
                                Bảng xếp hạng
                            </h2>
                            {/* <div className="">
                                <input type="text" className="form-control" placeholder="Tìm người dùng"/>
                            </div> */}
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <PageList curPage={curPage} maxPage={maxPage} setCurPage={setCurPage} />
                        <table cellSpacing="0" cellPadding="0" border="1" className="table table-hover transitions align-middle m-0 mt-2 mb-2 " >
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
            <th className="col-1">Xếp hạng</th>
            <th className="col-2">Tên người dùng</th>
            <th className="col-1">Số bài đã giải</th>
            <th className="col-1">Tổng điểm</th>
        </tr>
    );
}
function RowList({ result, curPage, maxPage, setMaxPage, numPerPage }) {
    if (numPerPage === 0 || numPerPage == null) numPerPage = 10;
    const rowList = [];
    if (result == null) {
        for (let i = 0; i < numPerPage; i++)
            rowList.push(<LoadingRow key={i}/>)
    } else {
        result = JSON.parse(result);
        for (let i = (curPage - 1) * numPerPage; i < curPage * numPerPage && i < result.length; i++) {
            let element = result[i];

            rowList.push(<UserRow
                key={element['UserName']}
                rankNumber={i+1}
                id={element['UserName']}
                name={element['FullName']}
                TotalProblemAC={element['TotalProblemAC']}
                TotalPointProblemAC={element['TotalPointProblemAC']}
            />);
        }
    }
    if (rowList.length === 0) rowList.push(<NoDataRow />)
    return rowList;
}
function UserRow({rankNumber, id, name, TotalProblemAC, TotalPointProblemAC}) {
    return (
        <tr>
            <td className="text-center">{rankNumber}</td>
            <td className="" >
                <Link to={'/user/' + id}>
                    <button type="button" className="btn btn-problem p-0">
                        {name}
                    </button>
                </Link>
            </td>
            <td className="text-center">{TotalProblemAC}</td>
            <td className="text-center">{TotalPointProblemAC}</td>
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
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-6"></span></td>
            <td className="placeholder-wave placeholder-glow"><span className={"placeholder col-" + parseInt(Math.random() * 5+4)}></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-6"></span></td>
            <td className="text-center placeholder-wave placeholder-glow"><span className="placeholder col-6"></span></td>
        </tr>
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
