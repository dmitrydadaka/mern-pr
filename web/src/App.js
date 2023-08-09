import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/public';

function App() {
  return (
    <Routes>
      <Route path='/' element={ <Layout />} >
        <Route index element={ <Public />} />
      </Route> 
    </Routes>
  );
}

export default App
