export default function PageList({ curPage, maxPage, setCurPage }) {
    const compList = [];
    for (let i = 1; i <= maxPage; i++) {
        compList.push(<PageButton
            key={i}
            curPage={curPage}
            setCurPage={setCurPage}
            numThisPage={i}
            maxPage={maxPage}
        />)
    }
    return (
        <div className="page">
            <ul className="ivu-page p-0 m-0">
                <PageButton curPage={curPage} setCurPage={setCurPage} maxPage={maxPage} numThisPage={curPage - 1} text="&lt;" />
                {compList}
                <PageButton curPage={curPage} setCurPage={setCurPage} maxPage={maxPage} numThisPage={curPage + 1} text="&gt;" />
                {/* <li title="Trang tiếp theo" className="ivu-page-next">
                    <a>
                        <i className="ivu-icon ivu-icon-ios-arrow-right">&gt;</i>
                    </a>
                </li> */}
            </ul>
        </div>
    )
}
function PageButton({ curPage, setCurPage, maxPage, numThisPage, text }) {
    if (text == null) text = numThisPage;
    return (
        <li className="ivu-page-item border-0">
            <button
                className={
                    "btn btn-outline-primary m-0 p-0 w-100 h-100"
                    + (numThisPage < 1 || numThisPage > maxPage ? " disabled" : "")
                    + (numThisPage === curPage ? " active" : "")
                }
                onClick={() => setCurPage(numThisPage)}
            >
                <font>{text}</font>
            </button>
        </li>
    )
}