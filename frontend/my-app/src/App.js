import Nav from './component/Nav.js';
import ProblemList from './view/problem/ProblemList.js';

function App() {
  return (
    <div className="App">
      <div  id="header">
        <Nav />
      </div>
      <div className="content-app" style={{background:'none'}}>
        <ProblemList/>
        {/* <h1>test</h1> */}
      </div>
    </div>
  );
}

export default App;
