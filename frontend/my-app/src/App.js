import Nav from './component/Nav.js';
import ProblemList from './view/ProblemList.js';
import Problem from './view/Problem.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <div className="content-app" style={{ background: 'none' }}>
          <Routes>
            {/* <h1>test</h1> */}
            <Route path='/' element={<h1>Hello World</h1>} />
            <Route path='/home' element={<h1>Hello World</h1>} />
            <Route path='/problems/*' element={<ProblemList />} />
            <Route path='/problem/:id' element={<Problem />} />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
