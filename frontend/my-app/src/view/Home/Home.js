import { useEffect } from 'react'
export default function Home() {
    function handle(e) {
        var input = document.querySelector('#testcase')
        let f = input.files[0];
        if (f == null) return;
        console.log(input.files[0])
        var data = new FormData()
        data.append('ProblemId', 'pb2')
        data.append('file', input.files[0])

        const requestOptions = {
            method: "POST",
            body: data,
            redirect: "follow"
        };

        fetch("http://127.0.0.1:5000/testfile", requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    }
    useEffect(() => {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        fetch("http://127.0.0.1:5000/testfile", requestOptions)
            .then((response) => response.blob())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        
    }, [])
    return (
        <div>
            <input id='testcase' type="file" onChange={e => handle(e)} />
        </div>
    )
}