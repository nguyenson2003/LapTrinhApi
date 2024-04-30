import './Nav.css';
export default function Nav() {
    return <div  id="header">
        <ul  className="oj-menu ivu-menu ivu-menu-light ivu-menu-horizontal">
            <div  className="logo"><span>
                <font style={{ verticalAlign: 'inherit' }}>
                    <font style={{ verticalAlign: 'inherit' }}>MSC OJ</font>
                </font>
            </span></div>
            <NavItem href="/" text="Trang chủ" fa="fa-home" />
            <NavItem href="/problem" text="Các vấn đề" fa="fa-list" />
            <NavItem href="/submissions" text="Bài nộp" fa="fa-sliders" />
            <NavItem href="/rank" text="Bảng xếp hạng" fa="fa-ranking-star" />
            <NavItem href="/contest" text="Cuộc thi" fa="fa-trophy" />

            <NavLogin user={null} />
        </ul>
    </div>
}

function NavItem({ href, text, fa }) {
    let path = window.location.pathname;
    function goToLink(){
        window.location = href;
    }
    return (
        <li  className={"ivu-menu-item " + ((path.startsWith(href) && href!=="/") || path===href ? "ivu-menu-item-active ivu-menu-item-selected" : "")} onClick={goToLink}>
            <i  className={"fa-solid " + fa}></i>
            <font style={{ verticalAlign: 'inherit' }}>
                {text}
            </font>
        </li>
    )

}
function NavLogin({ user }) {
    if (user == null) {
        return (
            <div  className="btn-menu" >
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
                <div class="ivu-select-dropdown" style={{display: 'none'}}>
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