import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import axios from 'axios'
import Home from '../../views/sandbox/Home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import { Routes, Route, Navigate } from 'react-router-dom'
import NoPermission from '../../views/sandbox/noPermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import { Spin } from 'antd'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,

    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,

    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />

}
function NewsRouter(props) {

    const [BackRouteList, setBackRouteList] = useState([])

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:5000/rights'),
            axios.get('http://localhost:5000/children')
        ]).then(res => {
            // console.log(res)  [{...},{...}]
            setBackRouteList([...res[0].data, ...res[1].data])
            // console.log([...res[0].data, ...res[1].data])
        })
    }, [])

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    function checkRoute(item) {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }

    function checkUserPermission(item) {
        return rights.includes(item.key)
    }
    return (
        <Spin size='large' spinning={props.isLoading}>
            <Routes>

                {
                    BackRouteList.map(item => {
                        // console.log()
                        if (checkRoute(item) && checkUserPermission(item)) {
                            return <Route key={item.key} path={item.key} exact element={LocalRouterMap[item.key]} />
                        }
                        return null
                    })
                }
                <Route path="/" element={<Navigate to="/home" />} exact />
                {/* <Route path="*" element={<NoPermission />} /> */}
                {
                    BackRouteList.length > 0 && <Route path="*" element={<NoPermission />} />
                }
            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({
    isLoading
})

export default connect(mapStateToProps)(NewsRouter)