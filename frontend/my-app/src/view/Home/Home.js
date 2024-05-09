import { useEffect } from 'react'
export default function Home() {
    return (
        <div className="ivu-row" style={{ marginLeft: '-9px', marginRight: '-9px' }}>
            <div className="ivu-col ivu-col-span-24" style={{ paddingLeft: '9px', paddingRight: '9px' }}>
                <div className="ivu-card ">
                    <div className="ivu-card-head">
                        <div className="text-center">
                            <h2>
                                Chào mừng các bạn đến với MSC OJ
                            </h2>
                        </div>
                    </div>
                    <div className="ivu-card-body">
                        <p>Đây là trang web chấm bài trực tuyến</p>
                        <p>Để sử dụng các tính năng của trang web, hãy đăng ký một tài khoản mới. Nếu đã có tài khoản, ấn nút đăng nhập</p>
                        <p>Bấm nút bài tập để xem và làm các bài tập trên trang web</p>
                        <p>Xem kết quả bài làm ở mục bài nộp</p>
                        <p>Mở bảng xếp hạng để kiểm tra thứ hạng của mình</p>
                    </div>
                </div>
            </div>
        </div>
    )
}