import { Link, useLocation, useParams } from "react-router-dom"
import Markdown from 'react-markdown'
import filemd from './test.md'
import { useState, useRef, useEffect } from "react";
import './markdown.css'
import Editor from '@monaco-editor/react';


export default function Problem() {
    const { id } = useParams('id');
    const hashId = useLocation().hash;
    let [problemData, setProblemData] = useState(null)
    let [text, setText] = useState('');
    let [lang, setLang] = useState({ id: 'cpp', name: 'C++ 11' });
    fetch(filemd)
        .then(res => res.text())
        .then(text => setText(text));
    const langDemo = [
        { id: 'cpp', name: 'C++ 11' },
        { id: 'java', name: 'Java 17' },
        { id: 'py', name: 'Python 3' },
    ]
    useEffect(()=>{
        setTimeout(()=>{
            if(hashId=='#editor'){
                scorllToSubmit();
            }
        },500)
    },[])
    useEffect(() => {
        setProblemData(null);
        setTimeout(() => {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };
            var url = new URL("http://127.0.0.1:5000/problem/id");
            fetch(url, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                    let data = JSON.parse(result);
                    setProblemData(data);
                    
                })
                .catch((error) => {
                    setProblemData('[]');
                    console.error(error)
                })
        }, 1000)
    }, []);
    const editorRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function showValue() {
        alert(editorRef.current.getValue());
    }
    function scorllToSubmit(){
        const element = document.getElementById('editor');
                            if (element) {
                                element.scrollIntoView();
                            }
    }
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            <div className="ivu-col ivu-col-span-18" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card mb-3">
                    <div className="ivu-card-head">
                        <div className="panel-title">
                            <h2>
                                Demo markdown
                            </h2>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <Markdown className={'markdown'}>{text}</Markdown>
                    </div>
                </div>

                <div className="ivu-card mb-3" id="editor">
                    <div className="ivu-card-head d-flex align-items-center" >
                        <div className="panel-title col-6">
                            <h2>
                                Nộp bài
                            </h2>
                        </div>
                        <div className="row col-6">
                            <input type="hidden" name="lang" />
                            <label className="form-label">Ngôn ngữ:</label>
                            <div className="dropdown btn-group col-8">
                                <button type="button" className="btn btn-outline-primary">
                                    {lang.name}
                                </button>
                                <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split flex-grow-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <LangButton lang={langDemo[0]} setLang={setLang} />
                                    <LangButton lang={langDemo[1]} setLang={setLang} />
                                    <LangButton lang={langDemo[2]} setLang={setLang} />
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <div style={{ height: "300px" }}>
                            <Editor
                                defaultLanguage="cpp"
                                defaultValue={'//some code here'}
                                theme="vs-dark"
                                onMount={handleEditorDidMount}
                            />
                        </div>
                        <div className="text-end mt-3">
                            <button type="button" className="btn btn-primary" onClick={showValue}>Nộp bài</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ivu-col ivu-col-span-6" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head d-flex justify-content-between align-items-center">
                        <h3>Bài nộp</h3>
                        <div className="">
                            <Link >Tất cả</Link> | <Link >Của tôi</Link>
                        </div>

                    </div>
                    <div className="ivu-card-body pt-0">
                        <Link className="btn btn-primary col-12" to='#editor' onClick={() => {
                            scorllToSubmit()
                        }}>Nộp bài</Link>
                    </div>
                </div>
                <div className="ivu-card ivu-card-bordered mt-3">
                    <div className="ivu-card-head">
                        <h3>Thông tin bài tập</h3>
                    </div>
                    <div className="ivu-card-body">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Độ khó</td>
                                    <td>Trung bình</td>
                                </tr>
                                <tr>
                                    <td>Giới hạn thời gian</td>
                                    <td>1s</td>
                                </tr>
                                <tr>
                                    <td>Giới hạn bộ nhớ</td>
                                    <td>1000MB</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
function LangButton({ lang, setLang }) {
    return (
        <li><button type="button" className="dropdown-item" onClick={() => setLang(lang)}>{lang.name}</button></li>
    )

}