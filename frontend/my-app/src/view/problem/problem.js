import { Link, useParams } from "react-router-dom"
import Markdown from 'react-markdown'
import filemd from './test.md'
import { useState } from "react";
import './markdown.css'
export default function Problem() {
    const { id } = useParams('id');
    let [text, setText] = useState('');
    fetch(filemd)
        .then(res => res.text())
        .then(text => setText(text));
    // const requestOptions = {
    //     method: "GET",
    //     redirect: "follow"
    // };

    // fetch("http://127.0.0.1:5000/Problems", requestOptions)
    //     .then((response) => response.text())
    //     .then((result) => {
    //         setRes(result);
    //     })
    //     .catch((error) => {
    //         setRes(null);
    //         console.error(error)
    //     });
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            <div className="ivu-col ivu-col-span-18" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ">
                    <div className="ivu-card-head">
                        <div className="panel-title">
                            <h1>
                                Demo markdown
                            </h1>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <Markdown className={'markdown'}>{text}</Markdown>
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
                        <Link className="btn btn-primary col-12">Nộp bài</Link>
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