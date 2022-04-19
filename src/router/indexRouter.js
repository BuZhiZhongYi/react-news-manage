import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Login from '../views/login/Login'
import Detail from '../views/news/Detail'
import News from '../views/news/News'
import NewsSandBox from '../views/sandbox/NewSandBox'

export default function IndexRouter() {

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/news" element={<News />} />
                <Route path="/detail/:id" element={<Detail />} />
                {/* 需要指定通配符 */}
                {/* <Route path="/*" {{localStorage.getItem('token')} ? element = { NewsSandBox } : element = { Login }} /> */}
                <Route path="/*" element={<NewsSandBox />} />
            </Routes>
        </HashRouter>
    )
}
