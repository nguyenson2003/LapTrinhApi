import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import Editor from '@monaco-editor/react';

export default function AddProblem() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tagData, setTagData] = useState([]);
    const tagDemo = [
        { ProblemTypeId: 1, ProblemTypeName: 'Adhoc' },
    ]
    const [filterTagSearch, setFilterTagSearch] = useState('');

    const [filterName, setFilterName] = useState('');
    const [filterTag, setFilterTag] = useState(null);
    const [filterDifficult, setFilterDifficult] = useState(0);

    const [mess, setMess] = useState('')
    function filterSubmitHandle(event) {
        event.preventDefault();
        let param = {}
        param['nameProblem'] = filterName
        param['tag'] = filterTag
        param['difficult'] = filterDifficult
    }
    useEffect(() => {
        setTimeout(() => {
            setTagData(tagDemo);
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            var url = new URL("http://127.0.0.1:5000/typeprob");
            fetch(url, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    let temp = JSON.parse(result);
                    console.log(temp)
                    setTagData(temp);
                })
                .catch((error) => {
                    setTagData([]);
                    console.error(error)
                })
        }, 100)
    }, []);
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function showValue() {
        alert(editorRef.current.getValue());
    }
    return (
        <div className="ivu-row">
            <div className="ivu-col ivu-col-span-24 ">
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head">
                        <h3>Tìm kiếm bài tập</h3>
                    </div>
                    <div className="ivu-card-body">
                        <form id="filter" onSubmit={filterSubmitHandle}>
                            <div className='mb-3'>
                                <label className="form-label" htmlFor="nameProblem">ID bài tập</label>
                                <input onChange={(e) => setFilterName(e.target.value)} type="text" className="form-control col-6" id="nameProblem" name="nameProblem" placeholder="Ví dụ: pb1" value={filterName} />
                                <div class="form-text">Hai bài tập không được trùng ID</div>
                            </div>

                            <div className='mb-3'>
                                <label className="form-label" htmlFor="nameProblem">Tên đề bài</label>
                                <input onChange={(e) => setFilterName(e.target.value)} type="text" className="form-control col-6" id="nameProblem" name="nameProblem" placeholder="Ví dụ: Hello World!" value={filterName} />
                            </div>
                            <div className="mt-2">
                                <input type="hidden" value={filterTag === null ? 0 : filterTag.ProblemTypeId} name="tag" />
                                <label className="form-label col-12">Kiểu bài tập:</label>
                                <div className="dropdown btn-group">
                                    <button type="button" className="btn btn-outline-primary ">
                                        {filterTag === null ? "Tất cả" : filterTag.ProblemTypeName}
                                    </button>
                                    <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split flex-grow-0" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className="visually-hidden">Toggle Dropdown</span>
                                    </button>
                                    <div className="dropdown-menu p-4 dropdown-menu-lg-end" style={{ width: '300px', maxHeight: '40vh', overflowY: 'auto' }}>
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
                            <div className='mb-3'>
                                <label className="form-label" htmlFor="nameProblem">Điểm bài tập</label>
                                <input onChange={(e) => setFilterName(e.target.value)} type="number" className="form-control col-6" id="nameProblem" name="nameProblem" value={filterName} />
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="nameProblem">Giới hạn thời gian (đơn vị: giây)</label>
                                    <input onChange={(e) => setFilterName(e.target.value)} type="number" className="form-control col-6" id="nameProblem" name="nameProblem" value={filterName} />
                                </div>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="nameProblem">Giới hạn bộ nhớ (đơn vị: kilobyte)</label>
                                    <input onChange={(e) => setFilterName(e.target.value)} type="number" className="form-control col-6" id="nameProblem" name="nameProblem" value={filterName} />
                                </div>
                            </div>
                            <label className="form-label" htmlFor="contentProblem">Nội dung bài tập (Sử dụng <a href='https://vi.wikipedia.org/wiki/Markdown'>Markdown</a>)</label>
                            <div className='shadow mb-3' id='contentProblem' style={{ height: "300px" , border:'2px #dee2e6 solid'}}>
                                <Editor
                                    defaultLanguage="cpp"
                                    defaultValue={'In ra màn hình Hello World!'}
                                    theme="vs-light"
                                    onMount={handleEditorDidMount}
                                />
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="nameProblem">File Testcase</label>
                                    <input onChange={(e) => setFilterName(e.target.value)} type="file" className="form-control col-6" id="nameProblem" value={filterName} />
                                </div>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="nameProblem">Số lượng testcase</label>
                                    <input onChange={(e) => setFilterName(e.target.value)} type="number" className="form-control col-6" id="nameProblem" value={filterName} />
                                </div>
                            </div>
                            <div className="gap-2 mt-3">
                                <button className="btn btn-primary btn-submit" type="submit">
                                    Thêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
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
        if (tag.ProblemTypeName.toLowerCase().indexOf(filterTagSearch.toLowerCase()) === -1) {
            return;
        }
        item.push(
            <TagButton key={tag.ProblemTypeId} tag={tag} setFilterTag={setFilterTag} />
        );
    });
    return item;
}
function TagButton({ tag, setFilterTag }) {
    return (
        <button type="button" className="btn btn-secondary btn-sm m-1" onClick={() => setFilterTag(tag)}>
            {tag.ProblemTypeName}
        </button>
    )
}