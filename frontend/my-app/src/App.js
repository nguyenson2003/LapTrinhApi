import Nav from './component/Nav.js';
import ProblemList from './view/Problem/ProblemList.js';
import Problem from './view/Problem/Problem.js';
import SubmissionList from './view/Submission/SubmissionList.js';
import UserRank from './view/Rank/UserRank.js'
import AddProblem from './view/admin/Them_Bai_Tap.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import UserProfile from './view/UserProfile/UserProfile.js';
import Home from './view/Home/Home.js';
function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <div className="content-app ms-3 me-3 mt-3" style={{ background: 'none' }}>
          <Routes>
            {/* <h1>test</h1> */}
            <Route path='/' element={<Home/>} />
            <Route path='/home' element={<h1>Hello World</h1>} />
            <Route path='/problems' element={<ProblemList />} />
            <Route path='/problem/:id' element={<Problem />} />
            <Route path='/submissions' element={<SubmissionList />} />
            <Route path='/rank' element={<UserRank />} />
            <Route path='/user/:id' element={<UserProfile />} />
            <Route path='/admin/problem/add' element={<AddProblem />} />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
