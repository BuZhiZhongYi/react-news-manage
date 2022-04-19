import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';

const { confirm } = Modal;
export default function RightList() {

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/rights?_embed=children")
            .then(res => {
                //处理拿到的数据
                //对数据进行遍历
                //如果数据中的某一项的child为空数组
                //则设置为空
                //使之没有下拉
                const list = res.data
                list.forEach(element => {
                    if (element.children.length === 0) {
                        element.children = ''
                    }
                });
                setDataSource(list)
            }
            )
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
            title: '权限名称',
            dataIndex: 'title',
            key: 'age',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'address',
            render: (address) => {
                return <Tag color="gold">{address}</Tag>
            }
        },
        {
            title: '操作',
            //传入的item为该项自身
            render: (item) => {
                return <div>
                    <Button onClick={() => showConfirm(item)} danger shape="circle" icon={<DeleteOutlined />} />&nbsp;&nbsp;

                    <Popover content={<div style={{ textAlign: "center" }}><Switch checked={item.pagepermisson} onClick={() => switchMethod(item)}></Switch></div>} title="配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                        <Button shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
                    </Popover>

                </div>
            }
        }
    ];

    function switchMethod(item) {
        // console.log(item.pagepermisson)
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:5000/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
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

    //删除方法
    function deleteMethod(item) {
        if (item.grade === 1) {
            //设置后端返回的数据
            setDataSource(dataSource.filter(i => i.id !== item.id))
            //同步设置后端数据
            axios.delete(`http://localhost:5000/rights/${item.id}`)
        } else {
            //通过grade找到上一层
            const list = dataSource.filter(data => data.id === item.grade)
            //通过第一层修改第二层
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            //设置数据
            setDataSource([...dataSource])
            axios.delete(`http://localhost:5000/children/${item.id}`)
        }
    }
    return (
        // pagination设置分页
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    )
}
