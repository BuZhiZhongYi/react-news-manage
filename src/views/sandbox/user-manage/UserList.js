import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';
import UserForm from '../../../components/user-manage/UserForm';

const { confirm } = Modal;
export default function UserList() {

    const [dataSource, setDataSource] = useState([])
    const [regionList, setRegionList] = useState([])
    const [roleList, setRoleList] = useState([])
    const [isVisible, setIsVisible] = useState(false)
    const [isUpdateVisible, setIsUpdateVisible] = useState(false)
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
    const [current, setCurrent] = useState(null)

    const ref = useRef(null)
    const updateRef = useRef(null)

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

    const roleObj = {
        '1': 'superadmin',
        '2': 'admin',
        '3': 'editor'
    }

    useEffect(() => {
        axios.get("http://localhost:5000/users?_expand=role").then(res => {
            const list = res.data
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[roleId] === 'editor')
            ])
        })
    }, [region, roleId, roleObj])
    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => { setRoleList(res.data) })
    }, [])
    useEffect(() => {
        axios.get("http://localhost:5000/regions").then(res => { setRegionList(res.data) })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })), {
                    text: "全球",
                    value: "全球"
                }
            ],
            onFilter: (value, item) => {
                if (value === "全球") {
                    return item.region === ''
                }
                return item.region === value
            },
            // 加粗
            render: (region) => {
                return <b>{region === '' ? "全球" : region}</b>
            },

        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            // 第二个参数是当前对象
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => { handleChange(item) }}></Switch>
            }
        },
        {
            title: '操作',
            //传入的item为该项自身
            render: (item) => {
                return <div>
                    <Button onClick={() => showConfirm(item)} danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} />&nbsp;&nbsp;
                    <Button shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
                </div>
            }
        }
    ];

    function handleUpdate(item) {

        setTimeout(() => {
            setIsUpdateVisible(true)
            if (item.roleId === 1) {
                //禁用
                setIsUpdateDisabled(true)
            } else {
                //取消禁用
                setIsUpdateDisabled(false)
            }
            updateRef.current.setFieldsValue(item)
        }, 0)
        setCurrent(item)
    }

    function handleChange(item) {
        // console.log(item)
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`http://localhost:5000/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    function showConfirm(item) {
        confirm({
            title: 'Do you Want to delete these items?',
            icon: <ExclamationCircleOutlined />,
            content: 'OK or Cancel',
            onOk() {
                // console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    }

    function addFormOK() {
        ref.current.validateFields().then(value => {
            // console.log(value)
            setIsVisible(false)

            ref.current.resetFieldValue()
            //先添加给后端
            axios.post("http://localhost/users", {
                ...value,
                roleState: true,
                default: false
            }).then(res => {
                // console.log(res.data)
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }])
            })
        }).catch(err => {
            console.log(err)
        })
    }

    function updateFormOK() {
        updateRef.current.validateFields().then(value => {
            setIsUpdateVisible(false)

            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))

            setIsUpdateDisabled(!isUpdateDisabled)
            axios.patch(`http://localhost:5000/users${current.id}`, { value })
        })
    }

    //删除方法
    function deleteMethod(item) {
        setDataSource(dataSource.filter(data => data.id !== item.id))

        axios.delete(`http://localhost:5000/${item.id}`)
    }
    return (
        // pagination设置分页
        <div>
            <Button type="primary" onClick={() => { setIsVisible(true) }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />

            <Modal
                visible={isVisible}
                title="添加用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {
                    setIsVisible(false)
                }}
                onOk={() => addFormOK()}
            >
                <UserForm ref={ref} regionList={regionList} roleList={roleList}></UserForm>
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="确认"
                cancelText="取消"
                onCancel={() => {
                    setIsUpdateVisible(false)
                    setIsUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm ref={updateRef} regionList={regionList} roleList={roleList} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
            </Modal>
        </div>
    )
}

