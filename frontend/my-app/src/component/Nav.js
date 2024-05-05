import './Nav.css';
import { Link } from 'react-router-dom';

export default function Nav() {
    return (
        <ul className="oj-menu ivu-menu ivu-menu-light ivu-menu-horizontal">
            <div className="logo"><span>
                <font style={{ verticalAlign: 'inherit' }}>
                    <font style={{ verticalAlign: 'inherit' }}>MSC OJ</font>
                </font>
            </span></div>
            <NavItem to="/" text="Trang chủ" fa="fa-home" />
            <NavItem to="/problems" text="Các vấn đề" fa="fa-list" />
            <NavItem to="/submissions" text="Bài nộp" fa="fa-sliders" />
            <NavItem to="/rank" text="Bảng xếp hạng" fa="fa-ranking-star" />
            <NavItem to="/contests" text="Cuộc thi" fa="fa-trophy" />

            <NavLogin user={null} />
        </ul>
    )
}

function NavItem({ to, text, fa }) {
    let path = window.location.pathname;
    function goToLink() {
        window.location = to;
    }
    return (
        <Link to={to} className='ivu-menu-item p-0 m-0'>
            <li className={"ivu-menu-item " + ((path.startsWith(to) && to !== "/") || path === to ? "ivu-menu-item-active ivu-menu-item-selected" : "")} >
                <i className={"fa-solid " + fa}></i>
                <font style={{ verticalAlign: 'inherit' }}>
                    {text}
                </font>
            </li>
        </Link>
    )

}
function NavLogin({ user }) {
    if (user == null) {
        return (
            <div className="btn-menu" >
                <button type="button" className="ivu-btn ivu-btn-ghost ivu-btn-circle">
                    <span>
                        <font style={{ verticalAlign: 'inherit' }}>
                            <font style={{ verticalAlign: 'inherit' }}>Đăng nhập
                            </font>
                        </font>
                    </span>
                </button>
                <button type="button" className="ivu-btn ivu-btn-ghost ivu-btn-circle" style={{ marginLeft: '5px' }}>
                    <span>
                        <font style={{ verticalAlign: 'inherit' }}>
                            <font style={{ verticalAlign: 'inherit' }}>Đăng ký
                            </font>
                        </font>
                    </span>
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