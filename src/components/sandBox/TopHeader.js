import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux'
import CollapsedReducer from '../../redux/reducer/CollapsedReducer';

const { Header } = Layout;

function TopHeader(props) {

    const navigate = useNavigate()

    function changeCollapsed() {
        props.changeCollapsed()
    }

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>

            <Menu.Item danger onClick={() => {
                localStorage.removeItem("token")
                navigate(`/login`)
            }}>退出</Menu.Item>
        </Menu>
    )

    return (
        <Header className="site-layout-background" style={{ paddingLeft: "16px", paddingTop: "0px" }}>

            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
            }

            <div style={{ float: "right", position: "absolute", top: 0, right: "24px" }}>
                {/* {username} */}
                <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>

        </Header >
    )
}
//返回{ CollapsedReducer: { isCollapsed } }
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
    return {
        isCollapsed
    }
}

const mapPropsToState = {
    changeCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}
//创建并返回一个容器组件
export default connect(mapStateToProps, mapPropsToState)(TopHeader)
