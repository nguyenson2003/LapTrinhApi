import { useEffect, useState } from 'react';
import './Nav.css';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
    const [username, setUsername] = useState(localStorage.getItem('username', ''))
    const [password, setPassword] = useState(localStorage.getItem('password', ''))

    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        let url = "http://127.0.0.1:5000/account/check?isrequireadmin=p&UserName=" + username + "&PassWord=" + password
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                // console.log(result)
                let mss = JSON.parse(result)[0].result;
                if (mss == 'True') {

                } else {
                    localStorage.setItem("username", '');
                    localStorage.setItem("password", '');
                }
            })
            .catch((error) => {
                console.error(error)
            });
    }, [])
    return (
        <>
            <div id="header">
                <div className="oj-menu ivu-menu ivu-menu-light ivu-menu-horizontal d-flex flex-wrap h-auto">
                    <div className="logo">
                        MSC OJ
                    </div>
                    <NavItem to="/" text="Trang chủ" fa="fa-home" />
                    <NavItem to="/problems" text="Các vấn đề" fa="fa-list" />
                    <NavItem to="/submissions" text="Bài nộp" fa="fa-sliders" />
                    <NavItem to="/rank" text="Bảng xếp hạng" fa="fa-ranking-star" />
                    {/* <NavItem to="/contests" text="Cuộc thi" fa="fa-trophy" /> */}

                    <NavLogin user={username} />

                </div>
            </div>
            <LoginDialog />
            <SigninDialog />
        </>
    )
}

function NavItem({ to, text, fa }) {
    let location = useLocation();
    return (
        <Link to={to} className={'ps-3 pe-3 ivu-menu-item ' + (location.pathname == to ? "ivu-menu-item-active ivu-menu-item-selected" : "")}>
            <i className={"m-1 fa-solid " + fa}></i>
            {text}
        </Link>
    )

}
function NavLogin({ user }) {
    function logout() {
        localStorage.setItem("username", '');
        localStorage.setItem("password", '');
        window.location.reload();
    }
    if (user == null || user == '') {
        return (
            <div className="btn-menu" style={{
                flexGrow: '1',
                textAlign: 'right'
            }}>
                <button type="button" className="ivu-btn ivu-btn-ghost ivu-btn-circle" data-bs-toggle="modal" data-bs-target="#loginDialog">
                    Đăng nhập
                </button>
                <button type="button" className="ivu-btn ivu-btn-ghost ivu-btn-circle ms-1" data-bs-toggle="modal" data-bs-target="#signinDialog">
                    Đăng ký
                </button>
            </div>
        )
    } else {
        return (
            <div class="dropdown flex-grow-1 text-end">
                <button class="btn  dropdown-toggle me-3" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {user}
                </button>
                <ul class="dropdown-menu">
                    <li><button class="dropdown-item btn" onClick={logout}>Đăng xuất</button></li>
                </ul>
            </div>
        )
    }
}
function LoginDialog() {
    const [UserName, setUserName] = useState('')
    const [PassWord, setPassWord] = useState('')
    const [mess, setMess] = useState('')
    function filterSubmitHandle(event) {
        event.preventDefault();
        let param = {}
        param['UserName'] = UserName
        param['PassWord'] = PassWord
        // console.log(UserName)
        // console.log(PassWord)
        let raw = JSON.stringify(param)
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };
        let url = "http://127.0.0.1:5000/account/check?isrequireadmin=p&UserName=" + UserName + "&PassWord=" + PassWord
        fetch(url, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let mss = JSON.parse(result)[0].result
                // console.log(result)
                if (mss == 'True') {
                    localStorage.setItem("username", UserName);
                    localStorage.setItem("password", PassWord);
                    window.location.reload();
                } else {
                    setMess(mss)
                }
            })
            .catch((error) => { console.error(error); });
        // console.log(param)
    }
    return (
        <div className="modal fade" id="loginDialog" tabIndex="-1" aria-labelledby="LoginLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="LoginLabel">Đăng nhập</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={filterSubmitHandle}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="loginUsername" className="form-label">Tên tài khoản</label>
                                <input onChange={e => setUserName(e.target.value)} required type="text" className="form-control" id="loginUsername" name="loginUsername" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="loginPassword" className="form-label">Mật khẩu</label>
                                <input onChange={e => setPassWord(e.target.value)} required type="password" className="form-control" id="loginPassword" name="loginPassword" />
                            </div>
                            <div className='form-text text-warning'>{mess}</div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <a className='text-decoration-underline link-underline link-underline-primary link-underline-opacity-75"' data-bs-toggle="modal" data-bs-target="#signinDialog">Bạn chưa có tài khoản? - đăng ký</a>
                            <div>
                                <button type="button" className="btn btn-secondary me-1" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-primary">Đăng nhập</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
function SigninDialog() {
    const [UserName, setUserName] = useState('')
    const [PassWord, setPassWord] = useState('')
    const [confirmPassWord, setConfirmPassWord] = useState('')
    const [FullName, setFullName] = useState('')
    const [mess, setMess] = useState('')
    const PermissionId = 'pms3'
    function filterSubmitHandle(event) {
        event.preventDefault();
        let param = {}
        if ((PassWord.length < 6 || PassWord.length > 12)) {
            setMess("Mật khẩu không đúng định dạng");
            return;
        }
        if (PassWord != confirmPassWord) {
            setMess("Mật khẩu và mật khẩu được nhập lại ko trùng khớp");
            return;
        }
        param['UserName'] = UserName
        param['PassWord'] = PassWord
        param['FullName'] = FullName
        param['PermissionId'] = PermissionId
        // console.log(param)
        let raw = JSON.stringify(param)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        fetch("http://127.0.0.1:5000/accounts", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let mss = JSON.parse(result).mess
                if (mss == 'success') {
                    localStorage.setItem("username", UserName);
                    localStorage.setItem("password", PassWord);
                    window.location.reload();
                } else {
                    setMess(mss)
                }
            })
            .catch((error) => { console.error(error); setMess(error) });
        // console.log(param)
    }
    return (
        <div className="modal fade" id="signinDialog" tabIndex="-1" aria-labelledby="SigninLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="SigninLabel">Đăng ký</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={filterSubmitHandle}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="SigninUsername" className="form-label">Tên tài khoản</label>
                                <input type="text" className="form-control" id="SigninUsername" required onChange={(e)=>setUserName(e.target.value)} />
                                <div id="usernameHelp" className="form-text">Đây là tên để đăng nhập tài khoản của bạn. Hai tài khoản không thể có cùng một tên tài khoản</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="SigninFullName" className="form-label">Tên hiển thị</label>
                                <input type="text" className="form-control" id="SigninFullName" required onChange={(e)=>setFullName(e.target.value)} />
                                <div id="FullNameHelp" className="form-text">Đây là tên hiển thị, tất mọi người sẽ thấy tên hiển thị này của bạn</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="SigninPassword" className="form-label">Mật khẩu</label>
                                <input type="password" className="form-control" id="SigninPassword" required onChange={(e)=>setPassWord(e.target.value)} />
                                <div className="form-text">Mật khẩu gồm 6 đến 12 ký tự</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="SigninConfirmPassword" className="form-label">Nhập lại mật khẩu</label>
                                <input type="password" className="form-control" id="SigninConfirmPassword" required onChange={(e)=>setConfirmPassWord(e.target.value)} />
                            </div>
                            <div className='form-text text-warning'>{mess}</div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <a className='text-decoration-underline link-underline link-underline-primary link-underline-opacity-75"' data-bs-toggle="modal" data-bs-target="#loginDialog">Bạn đã có tài khoản? - đăng nhập</a>
                            <div>
                                <button type="button" className="btn btn-secondary me-1" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-primary">Đăng ký</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}