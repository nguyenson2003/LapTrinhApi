import './Nav.css';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
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

                    <NavLogin user={null} />

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
    if (user == null) {
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
            <div className="drop-menu ivu-dropdown">
                <div className="ivu-dropdown-rel">
                    <button type="button" className="drop-menu-title ivu-btn ivu-btn-text">
                        <span>
                            {user}
                            <i className="ivu-icon ivu-icon-arrow-down-b"></i>
                        </span>
                    </button>
                </div>
                <div className="ivu-select-dropdown" style={{ display: 'none' }}>
                    <ul className="ivu-dropdown-menu">
                        <li className="ivu-dropdown-item">Thông tin</li>
                        <li className="ivu-dropdown-item">Đổi mật khẩu</li>
                        <li className="ivu-dropdown-item ivu-dropdown-item-divided">Logout</li>
                    </ul>
                </div>
            </div>
        )
    }
}
function LoginDialog() {
    return (
        <div className="modal fade" id="loginDialog" tabindex="-1" aria-labelledby="LoginLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="LoginLabel">Đăng nhập</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="loginUsername" className="form-label">Tên tài khoản</label>
                                <input required type="text" className="form-control" id="loginUsername" name="loginUsername" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="loginPassword" className="form-label">Mật khẩu</label>
                                <input required type="password" className="form-control" id="loginPassword" name="loginPassword" />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="loginRemember" name="loginRemember" />
                                <label className="form-check-label" htmlFor="loginRemember">Ghi nhớ đăng nhập</label>
                            </div>
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
    return (
        <div className="modal fade" id="signinDialog" tabindex="-1" aria-labelledby="SigninLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="SigninLabel">Đăng ký</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="SigninUsername" className="form-label">Tên tài khoản</label>
                                <input type="text" className="form-control" id="SigninUsername" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="SigninPassword" className="form-label">Mật khẩu</label>
                                <input type="password" className="form-control" id="SigninPassword" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="SigninConfirmPassword" className="form-label">Nhập lại mật khẩu</label>
                                <input type="password" className="form-control" id="SigninConfirmPassword" required />
                            </div>
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
