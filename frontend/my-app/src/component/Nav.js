export default function Nav() {
    return <div data-v-2e5fb307 id="header">
        <ul data-v-2e5fb307 className="oj-menu ivu-menu ivu-menu-light ivu-menu-horizontal">
            <div data-v-2e5fb307 className="logo"><span>
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
        <li data-v-2e5fb307 className={"ivu-menu-item " + ((path.startsWith(href) && href!=="/") || path===href ? "ivu-menu-item-active ivu-menu-item-selected" : "")} onClick={goToLink}>
            <i data-v-2e5fb307 className={"fa-solid " + fa}></i>
            <font style={{ verticalAlign: 'inherit' }}>
                {text}
            </font>
        </li>
    )

}
function NavLogin({ user }) {
    if (user == null) {
        return (
            <div data-v-2e5fb307 className="btn-menu" >
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
            <div data-v-2e5fb307="" class="drop-menu ivu-dropdown">
                <div class="ivu-dropdown-rel">
                    <button data-v-2e5fb307="" type="button" class="drop-menu-title ivu-btn ivu-btn-text">
                        <span>
                            {user}
                            <i data-v-2e5fb307="" class="ivu-icon ivu-icon-arrow-down-b"></i>
                        </span>
                    </button>
                </div>
                <div class="ivu-select-dropdown" style={{display: 'none'}}>
                    <ul data-v-2e5fb307="" class="ivu-dropdown-menu">
                        <li data-v-2e5fb307="" class="ivu-dropdown-item">Home</li>
                        <li data-v-2e5fb307="" class="ivu-dropdown-item">Submissions</li>
                        <li data-v-2e5fb307="" class="ivu-dropdown-item">Settings</li>
                        <li data-v-2e5fb307="" class="ivu-dropdown-item ivu-dropdown-item-divided">Logout</li>
                    </ul>
                </div>
            </div>
        )
    }
}