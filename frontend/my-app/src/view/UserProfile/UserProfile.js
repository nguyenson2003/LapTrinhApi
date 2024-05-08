import { Link, useLocation, useParams } from "react-router-dom"
import { useState, useRef, useEffect } from "react";


export default function UserProfile() {
    const { id } = useParams('id');
    const hashId = useLocation().hash;
    let [userData, setUserData] = useState(null)
    let [tagAcData, setTagAcData] = useState(null)
    let [diffAcData, setDiffAcData] = useState([0, 0, 0])
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        var url = new URL("http://127.0.0.1:5000/infacc/" + id);
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let data = JSON.parse(result)[0];
                console.log(data)
                setUserData(data);
                var url = new URL("http://127.0.0.1:5000/typeprob/" + id + "/ac");
                fetch(url, requestOptions)
                    .then((response) => response.text())
                    .then((result) => {
                        let data = JSON.parse(result);
                        console.log(data)
                        setTagAcData(data);
                        var url = new URL("http://127.0.0.1:5000/typeprob/" + id + "/orderbydif");
                        fetch(url, requestOptions)
                            .then((response) => response.text())
                            .then((result) => {
                                let data = JSON.parse(result);
                                console.log(data)
                                let temp = [0, 0, 0]
                                for (let i = 0; i < data.length; i++) {
                                    temp[data[i].Point - 1] = data[i].Quantity;
                                }
                                setDiffAcData(temp);
                            })
                            .catch((error) => {
                                setUserData([]);
                                console.error(error)
                            })
                    })
                    .catch((error) => {
                        setUserData([]);
                        console.error(error)
                    })
            })
            .catch((error) => {
                setUserData([]);
                console.error(error)
            })
    }, []);

    if (userData == null) return (<h1>404 Not Found</h1>)
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            <div className="ivu-col ivu-col-span-6" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head d-flex justify-content-between align-items-center">
                        <h3>{userData['FullName']}</h3>
                    </div>
                    <div className="ivu-card-body pt-0">
                        <div>Đã tham gia ngày: {userData.DateCreate}</div>
                        <Link>Các bài đã nộp</Link><br />
                        <Link>Các bài đã AC</Link>
                    </div>
                </div>
                <div className="ivu-card ivu-card-bordered mt-3">
                    <div className="ivu-card-head">
                        <h3>Các dạng bài tập đã giải</h3>
                    </div>
                    <div className="ivu-card-body pt-0">
                        <TagList tags={tagAcData}></TagList>
                    </div>

                </div>

            </div>
            <div className="ivu-col ivu-col-span-18" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card mb-3">
                    <div className="ivu-card-head">
                        <div className="panel-title">
                            <h2>
                                Thông số
                            </h2>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <table>
                            <tbody>
                                <tr className="mb-3">
                                    <td className="col-6"><h5>Số bài AC: </h5></td>
                                    <td><h5>{userData.TotalProblemAC}</h5></td>
                                </tr>
                                <tr className="mb-3">
                                    <td className="col-6"><h5>Tổng số bài nộp AC: </h5></td>
                                    <td><h5>{userData.TotalSubAC}</h5></td>
                                </tr>
                                <tr className="mb-3 text-success">
                                    <td className="col-6"><h5>Số bài dễ đã AC: </h5></td>
                                    <td><h5>{diffAcData[0]}</h5></td>
                                </tr>
                                <tr className="mb-3 text-warning">
                                    <td className="col-6"><h5>Số bài trung bình đã AC: </h5></td>
                                    <td><h5>{diffAcData[1]}</h5></td>
                                </tr>
                                <tr className="mb-3 text-danger">
                                    <td className="col-6"><h5>Số bài khó đã AC:  </h5></td>
                                    <td><h5>{diffAcData[2]}</h5></td>
                                </tr>
                            </tbody>
                        </table>
                        <br></br>
                        <h5>Tỷ lệ nộp bài AC:</h5>
                        <div class="progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                            <div class="progress-bar bg-success" style={{ width: userData.RateAC }}>{userData.RateAC}</div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
function TagList({ tags }) {
    if (tags == null) return (<></>)
    const item = [];
    tags.forEach((tag) => {
        item.push(
            <TagButton key={tag.ProblemTypeId} tag={tag} />
        );
    });
    return item;
}
function TagButton({ tag }) {
    return (
        <Link to={'/problems?tag=' + tag.ProblemTypeId}>
            <button type="button" className="btn btn-secondary btn-sm m-1 flex-grow-1">
                {tag.TypeProblem + " x" + tag.Quantity}
            </button>
        </Link>
    )
}