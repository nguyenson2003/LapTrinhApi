import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import Editor from '@monaco-editor/react';

export default function AddProblem() {
    const [permision,setPermision] = useState(false);
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        const username =(localStorage.getItem('username', ''))
        const password =(localStorage.getItem('password', ''))
        let url = "http://127.0.0.1:5000/account/check?isrequireadmin=1&UserName=" + username + "&PassWord=" + password
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log(result)
                let mss = JSON.parse(result)[0].result;
                if (mss == 'True') {
                    setPermision(true)
                } else {
                    setPermision(false)
                }
            })
            .catch((error) => {
                console.error(error)
            });
    }, [])
    const [searchParams, setSearchParams] = useSearchParams();
    const [tagData, setTagData] = useState([]);
    const [filterTagSearch, setFilterTagSearch] = useState('');
    const tagDemo = [
        { ProblemTypeId: 1, ProblemTypeName: 'Adhoc' },
    ]

    const [filterId, setFilterId] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterTag, setFilterTag] = useState(null);
    const [filterDifficult, setFilterDifficult] = useState(0);
    const [filterSecond, setFilterSecond] = useState(0);
    const [filterMemory, setFilterMemory] = useState(0);
    const [filterNumberTestcase, setNumberTestcase] = useState(0);
    function handleFile() {
        var input = document.querySelector('#testcaseFile')
        let f = input.files[0];
        if (f == null) return;
        var data = new FormData()
        data.append('ProblemId', filterId)
        data.append('file', input.files[0])
        data.append('NumberTestcase', filterNumberTestcase)
        const requestOptions = {
            method: "POST",
            body: data,
            redirect: "follow"
        };
        fetch("http://127.0.0.1:5000/testfile", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let mss = JSON.parse(result).mess
                if (mss == 'success') {
                } else {
                    setMess(mss)
                }
            })
            .catch((error) => console.error(error));
            
    }
    const editorRef = useRef(null);
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }
    function getContentEditor() {
        return (editorRef.current.getValue());
    }
    const [messSuccess, setMessSuccess] = useState('')
    const [mess, setMess] = useState('')
    const [count, setCount]=useState(0);
    function filterSubmitHandle(event) {
        event.preventDefault();
        let param = {}
        if(
            filterId==null || filterId=='' ||
            filterName==null || filterName=='' ||
            filterTag==null ||
            filterDifficult==0 ||
            getContentEditor().trim()==''||
            filterSecond==0||
            filterMemory==0
        ){
            setMess("Mời bạn nhập đầy đủ thông tin"+(count==0?'':' x'+(count+1)));
            setCount(count+1);
            return;
        }
        param['ProblemId'] = filterId
        param['ProblemName'] = filterName
        param['ProblemTypeId'] = filterTag.ProblemTypeId
        param['Point'] = filterDifficult
        param['Decribe'] = getContentEditor()
        param['TimeLimit'] = filterSecond
        param['MemoryLimit'] = filterMemory
        let raw = JSON.stringify(param)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        fetch("http://127.0.0.1:5000/problems", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let mss = JSON.parse(result).mess
                if (mss == 'success') {
                } else {
                    setMess(mss)
                }
            })
            .catch((error) => console.error(error));
        handleFile()

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
                    // console.log(temp)
                    setTagData(temp);
                })
                .catch((error) => {
                    setTagData([]);
                    console.error(error)
                })
        }, 100)
    }, []);

    if(permision==false)return<h1>404 Not Found</h1>
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
                                <label className="form-label" htmlFor="idProblem">ID bài tập</label>
                                <input onChange={(e) => setFilterId(e.target.value)} type="text" className="form-control col-6" id="idProblem" placeholder="Ví dụ: pb1"required />
                                <div className="form-text">Hai bài tập không được trùng ID</div>
                            </div>

                            <div className='mb-3'>
                                <label className="form-label" htmlFor="nameProblem">Tên đề bài</label>
                                <input onChange={(e) => setFilterName(e.target.value)} type="text" className="form-control col-6" id="nameProblem" placeholder="Ví dụ: Hello World!" required/>
                            </div>
                            <div className="mt-2">
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
                                            {/* <button type="button" onClick={() => setFilterTag(null)} className="btn p-0 m-0 link-primary text-decoration-underline">Bỏ chọn</button> */}
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
                                    <DifficultButton difficult={1} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                    <DifficultButton difficult={2} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                    <DifficultButton difficult={3} curDifficult={filterDifficult} setFilterDifficult={setFilterDifficult} />
                                </ul>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="secondProblem">Giới hạn thời gian (đơn vị: giây)</label>
                                    <input onChange={(e) => setFilterSecond(e.target.value)} type="number" className="form-control col-6" id="secondProblem" required/>
                                </div>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="memoryProblem">Giới hạn bộ nhớ (đơn vị: kilobyte)</label>
                                    <input onChange={(e) => setFilterMemory(e.target.value)} type="number" className="form-control col-6" id="memoryProblem" required/>
                                </div>
                            </div>
                            <label className="form-label" htmlFor="contentProblem">Nội dung bài tập (Sử dụng <a href='https://vi.wikipedia.org/wiki/Markdown'>Markdown</a>)</label>
                            <div className='shadow mb-3' id='contentProblem' style={{ height: "300px", border: '2px #dee2e6 solid' }}>
                                <Editor
                                    defaultLanguage="md"
                                    defaultValue={'In ra màn hình Hello World!'}
                                    theme="vs-light"
                                    onMount={handleEditorDidMount}
                                />
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="testcaseFile">File Testcase</label>
                                    <input type="file" className="form-control col-6" id="testcaseFile" required/>
                                    <div className="form-text">File testcase là 1 file zip chứa các file "in#.txt" và "out#.txt" với "#" được đánh số từ 1 đến số lượng testcase</div>
                                </div>
                                <div className='mb-3 col-6'>
                                    <label className="form-label" htmlFor="testcaseLength">Số lượng testcase</label>
                                    <input onChange={(e) => setNumberTestcase(e.target.value)} type="number" className="form-control col-6" id="testcaseLength" required/>
                                </div>
                            </div>
                            <dib className="form-text text-warning">{mess}</dib>
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