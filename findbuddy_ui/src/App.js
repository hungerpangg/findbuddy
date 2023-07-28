import Card from './components/Card';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Signup2 from './components/Signup2';

function App(){
    return (
        <div>
            <Router>
            <Navbar/>
            <Routes>
                {/* <Route path="/signin" /> */}
                <Route path="/signin" element={<Signin/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/signup2" element={<Signup2/>} />
            </Routes>
            </Router>
            {/* <Card/> */}
        </div>
    )
}

export default App;