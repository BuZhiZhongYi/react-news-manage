import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux'
import axios from 'axios'
import './index.css'


const { Sider } = Layout;
const { SubMenu } = Menu;


function SideMenu(props) {


    //实现路由跳转
    const navigate = useNavigate()
    //获取当前路径
    const location = useLocation()
    // console.log(location.pathname)

    const openKeys = ["/" + location.pathname.split("/")[1]]
    // console.log(openKeys)

    const [menu, setMenu] = useState([])

    //发送ajax请求，获取数据
    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children")
            //获取数据后填入menu 
            .then(res => {
                setMenu(res.data)
                // console.log(res.data)
            })
    }, [])

    //
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))

    //用于判断json中是否含有pagepermisson==1一项
    //含有的话才在侧边栏中显示 && rights.includes(item.key)
    function checkPagePermisson(item) {
        // console.log(item.key)
        return item.pagepermisson && rights.includes(item.key)
    }

    function renderMenu(menuList) {
        return menuList.map((item) => {
            //先判断是否含有children项，即是否有子项
            if (item.children?.length > 0 && checkPagePermisson(item)) {
                //若含有子项，则返回下拉表
                return <SubMenu key={item.key} title={item.title} >
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermisson(item) && <Menu.Item key={item.key} onClick={() => { navigate(`${item.key}`) }}>{item.title}</Menu.Item>
        })
    }

    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
                <div className="logo" >后台管理系统</div>
                <div style={{ display: "1", "overflow": "auto" }}>
                    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} defaultOpenKeys={openKeys}>
                        {renderMenu(menu)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
    isCollapsed
})

export default connect(mapStateToProps)(SideMenu)