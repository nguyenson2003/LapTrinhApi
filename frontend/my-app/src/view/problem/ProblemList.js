export default function ProblemList() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://127.0.0.1:5000/problem/getall", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    // console.log(1);
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            <div className="ivu-col ivu-col-span-18" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ">
                    <div className="ivu-card-head">
                        <div className="panel-title">
                            <div>
                                <h2>
                                    Danh sách vấn đề
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="ivu-card-body" style={{ padding: '0px' }}>
                        <div className="panel-body">
                            <div className="ivu-table-wrapper" style={{ width: '100%', fontSize: '16px' }}>
                                <div className="ivu-table">
                                    <div className="ivu-table-header">
                                        <table cellSpacing="0" cellPadding="0" border="0" >
                                            <thead>
                                                <tr>
                                                    <th >
                                                        <div className="ivu-table-cell"><span>
                                                            <font>
                                                                <font>#</font>
                                                            </font>
                                                        </span>  </div>
                                                    </th>
                                                    <th>
                                                        <div className="ivu-table-cell"><span>
                                                            <font>
                                                                <font>Tiêu đề
                                                                </font>
                                                            </font>
                                                        </span>  </div>
                                                    </th>
                                                    <th>
                                                        <div className="ivu-table-cell"><span>
                                                            <font>
                                                                <font>Mức độ
                                                                </font>
                                                            </font>
                                                        </span>  </div>
                                                    </th>
                                                    <th>
                                                        <div className="ivu-table-cell"><span>
                                                            <font>
                                                                <font>Tổng cộng
                                                                </font>
                                                            </font>
                                                        </span>  </div>
                                                    </th>
                                                    <th>
                                                        <div className="ivu-table-cell"><span>
                                                            <font>
                                                                <font>Tỷ lệ AC</font>
                                                            </font>
                                                        </span>  </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="ivu-table-tbody">
                                                <ProblemRow />
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="ivu-table-tip">
                                        <table cellSpacing="0" cellPadding="0" border="0">
                                            <tbody>
                                                <tr>
                                                    <td><span>
                                                        <font>
                                                            Không có dữ liệu lọc
                                                        </font>
                                                    </span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div data-v-5fdd8bf className="page">
                    <ul data-v-5fdd8bf className="ivu-page">
                        <li title="Trang trước" className="ivu-page-prev ivu-page-disabled"><a><i
                            className="ivu-icon ivu-icon-ios-arrow-left"></i></a></li>
                        <li title="1" className="ivu-page-item ivu-page-item-active"><a>
                            <font>
                                <font>1</font>
                            </font>
                        </a></li>
                        <li title="2" className="ivu-page-item"><a>
                            <font>
                                <font>2</font>
                            </font>
                        </a></li>
                        <li title="3" className="ivu-page-item"><a>
                            <font>
                                <font>3</font>
                            </font>
                        </a></li>
                        <li title="5 trang tiếp theo" className="ivu-page-item-jump-next"><a><i
                            className="ivu-icon ivu-icon-ios-arrow-right"></i></a></li>
                        <li title="43" className="ivu-page-item"><a>
                            <font>
                                <font>43</font>
                            </font>
                        </a></li>
                        <li title="Trang tiếp theo" className="ivu-page-next"><a><i
                            className="ivu-icon ivu-icon-ios-arrow-right"></i></a></li>
                    </ul>
                </div>
            </div>
            <div className="ivu-col ivu-col-span-6" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ivu-card-bordered">
                    <div className="ivu-card-head">
                        <div className="panel-title">
                            <div className="taglist-title">
                                <font>
                                    <h3>Tìm kiếm bài tập</h3>
                                </font>
                            </div>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <input type="email" className="form-control" id="nameSearch" placeholder="Tên đề bài" />
                        <div className="mt-2 row">
                            <label className="form-label col-12">Kiểu bài tập:</label>
                            <div className="dropdown btn-group">
                                <button type="button" className="btn btn-outline-primary">
                                    Tất cả
                                </button>
                                <button type="button" className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split flex-grow-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span class="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <form className="dropdown-menu p-4 dropdown-menu-lg-end">

                                </form>
                            </div>
                        </div>
                        <div className="mt-2">
                            <label className="form-label">Độ khó:</label>
                            <ul className="">
                                <li className="col me-1 btn btn-outline-success">Dễ</li>
                                <li className="col me-1 btn btn-outline-warning">Trung bình</li>
                                <li className="col me-1 btn btn-outline-danger">Khó</li>
                            </ul>
                        </div>
                        <div class="d-grid gap-2 mt-3">
                            <button className="btn btn-primary btn-submit" type="submit">
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function ProblemRow() {
    return (
        <tr className="ivu-table-row">
            <td>
                <div className="ivu-table-cell">
                    <button type="button"
                        className="ivu-btn ivu-btn-text ivu-btn-large"
                        style={{ padding: '2px 0px' }}>  <span>
                            <font>
                                <font>1
                                </font>
                            </font>
                        </span></button>
                </div>
            </td>
            <td>
                <div className="ivu-table-cell">
                    <button type="button"
                        className="ivu-btn ivu-btn-text ivu-btn-large"
                        style={{ padding: '2px 0px', textAlign: 'left', width: '100%' }}>
                        <span>
                            <font>
                                <font>Bài toán A+B đơn giản</font>
                            </font>
                        </span></button>
                </div>
            </td>
            <td>
                <div className="ivu-table-cell">

                    <div className="ivu-tag ivu-tag-blue ivu-tag-checked">
                        <span
                            className="ivu-tag-text ivu-tag-color-white">
                            <font>
                                <font>Giữa
                                </font>
                            </font>
                        </span>
                    </div>
                </div>
            </td>
            <td>
                <div className="ivu-table-cell">   <span>
                    <font>
                        <font>8693
                        </font>
                    </font>
                </span>  </div>
            </td>
            <td>
                <div className="ivu-table-cell">
                    <span>
                        <font>
                            <font>48,21%
                            </font>
                        </font>
                    </span>
                </div>
            </td>
        </tr>
    )
}