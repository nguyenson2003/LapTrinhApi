import { useParams } from "react-router-dom"
import Markdown from 'react-markdown'
import filemd from './test.md'
import { useState } from "react";
export default function Problem() {
    const { id } = useParams('id');
    let [text,setText] = useState('');
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
                        <Markdown>{text}</Markdown>
                    </div>
                </div>
            </div>
            <div className="ivu-col ivu-col-span-6" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head">
                        <h3>Thông tin bài tập</h3>
                    </div>
                    <div className="ivu-card-body">
                        Giới hạn thời gian
                        Giới hạn bộ nhớ
                    </div>
                </div>
            </div>
        </div>
    )
}