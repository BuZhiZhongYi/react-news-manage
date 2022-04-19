import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

const { confirm } = Modal

export default function RoleList() {

    const [dataSource, setDataSource] = useState([])
    const [currentSource, setCurrentSource] = useState([])
    const [currentId, setCurrentId] = useState(0)
    const [rightList, setRightList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:5000/roles").then(res => { setDataSource(res.data) })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children").then(res => { setRightList(res.data) })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            // 加粗
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger onClick={() => showConfirm(item)} shape="circle" icon={<DeleteOutlined />}></Button>&nbsp;&nbsp;
                    <Button shape="circle" icon={<UnorderedListOutlined />}
                        onClick={() => {
                            setIsModalVisible(true)
                            setCurrentSource(item.rights)
                            setCurrentId(item.id)
                            // console.log(item)
                        }}></Button>
                </div>
            }
        }
    ]

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

    //删除方法
    function deleteMethod(item) {
        //设置后端返回的数据
        setDataSource(dataSource.filter(i => i.id !== item.id))
        //同步设置后端数据
        axios.delete(`http://localhost:5000/roles/${item.id}`)
    }

    function handleOk() {
        setIsModalVisible(false)
        // console.log(currentId, currentSource)
        setDataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentSource
                }
            }
            return item
        }))

        axios.patch(`http://localhost:5000/roles/${currentId}`, { rights: currentSource })
    }

    function handleCancel() {
        setIsModalVisible(false)
    }

    function onCheck(checkKeys) {
        setCurrentSource(checkKeys.checked)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>

            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree checkable treeData={rightList} checkedKeys={currentSource} onCheck={onCheck} checkStrictly={true} />
            </Modal>
        </div>
    )
}
