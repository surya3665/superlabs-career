import { Outlet,Link  } from "react-router-dom"



function MainLayout() {


  return (
    <div>
      <div className="flex flex-row bg-blue-gray-200" >
      <div className="w-72 gap-10 px-10 shadow-lg bg-slate-100 h-screen flex flex-col ">
        <Link to="/" className="text-2xl font-bold py-8">Superlabs Careers</Link>
        <h6 className="py-5 text-md font-bold text-gray-600">Menu</h6>
        <Link to="/">Dashboard</Link>
        <Link to="/jobpost">JobPost</Link>
        <Link to="/location">Location</Link>
        <Link to="/category">Categories</Link>
        <Link to="/users">Users</Link>
        <Link to="/selectedcandidates">Selected Candidates</Link>
      </div>
      <main>
        <Outlet/>
      </main>
    </div>
    </div>
  )
}

export default MainLayout
