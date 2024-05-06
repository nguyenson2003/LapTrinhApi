import './Nav.css';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
    return (
        <>
            <div id="header">
                <ul className="oj-menu ivu-menu ivu-menu-light ivu-menu-horizontal">
                    <div className="logo"><span>

                        MSC OJ

                    </span></div>
                    <NavItem to="/" text="Trang chủ" fa="fa-home" />
                    <NavItem to="/problems" text="Các vấn đề" fa="fa-list" />
                    <NavItem to="/submissions" text="Bài nộp" fa="fa-sliders" />
                    <NavItem to="/rank" text="Bảng xếp hạng" fa="fa-ranking-star" />
                    <NavItem to="/contests" text="Cuộc thi" fa="fa-trophy" />

                    <NavLogin user={null} />

                </ul>
            </div>
            <LoginDialog />
            <SigninDialog/>
        </>
    )
}

function NavItem({ to, text, fa }) {
    let location = useLocation();
    return (
        <Link to={to} className='ivu-menu-item p-0 m-0'>
            <li className={"ivu-menu-item " + (location.pathname == to ? "ivu-menu-item-active ivu-menu-item-selected" : "")} >
                <i className={"fa-solid " + fa}></i>

                {text}

            </li>
        </Link>
    )

}
function NavLogin({ user }) {
    if (user == null) {
        return (
            <div className="btn-menu" >
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
            <div class="drop-menu ivu-dropdown">
                <div class="ivu-dropdown-rel">
                    <button type="button" class="drop-menu-title ivu-btn ivu-btn-text">
                        <span>
                            {user}
                            <i class="ivu-icon ivu-icon-arrow-down-b"></i>
                        </span>
                    </button>
                </div>
                <div class="ivu-select-dropdown" style={{ display: 'none' }}>
                    <ul class="ivu-dropdown-menu">
                        <li class="ivu-dropdown-item">Home</li>
                        <li class="ivu-dropdown-item">Submissions</li>
                        <li class="ivu-dropdown-item">Settings</li>
                        <li class="ivu-dropdown-item ivu-dropdown-item-divided">Logout</li>
                    </ul>
                </div>
            </div>
        )
    }
}
function LoginDialog() {
    return (
        <div class="modal fade" id="loginDialog" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Đăng nhập</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Tên tài khoản</label>
                                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="exampleInputPassword1" />
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                                <label class="form-check-label" for="exampleCheck1">Ghi nhớ đăng nhập</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-primary">Đăng nhập</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
function SigninDialog() {
    return (
        <div class="modal fade" id="signinDialog" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Đăng ký</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Tên tài khoản</label>
                                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Mật khẩu</label>
                                <input type="password" class="form-control" id="exampleInputPassword1" />
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Nhập lại mật khẩu</label>
                                <input type="password" class="form-control" id="exampleInputPassword1" />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" class="btn btn-primary">Đăng ký</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
