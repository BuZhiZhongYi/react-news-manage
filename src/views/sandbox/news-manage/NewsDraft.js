import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { Table, Button, Modal, notification } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios';

const { confirm } = Modal;
export default function NewsDraft() {

    const navigate = useNavigate()
    const [dataSource, setDataSource] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_expend=categoryId`)
            .then(res => {
                //处理拿到的数据
                //对数据进行遍历
                //如果数据中的某一项的child为空数组
                //则设置为空
                //使之没有下拉
                const list = res.data
                setDataSource(list)
            }
            )
    }, [username])

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
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '分类',
            dataIndex: 'categoryId'
        },
        {
            title: '操作',
            //传入的item为该项自身
            render: (item) => {
                return <div>
                    {/* 删除 */}
                    <Button onClick={() => showConfirm(item)} danger shape="circle" icon={<DeleteOutlined />} />&nbsp;&nbsp;
                    {/* 编辑 */}
                    <Button shape="circle" icon={<EditOutlined />} onClick={() => {
                        navigate(`/news-manage/update/${item.id}`)
                    }} />&nbsp;&nbsp;
                    {/* 上传 */}
                    <Button type='primary' shape="circle" icon={<UploadOutlined />} onClick={() => handleCheck(item.id)} />
                </div>
            }
        }
    ];

    function handleCheck(id) {
        axios.patch(`http://localhost:5000/news/${id}`, {
            auditState: 1
        }).then(res => {
            navigate('/audit-manage/list')
            notification.info({
                message: `提示`,
                description:
                    '您可以在审核列表中查看您的新闻',
                placement: "bottomRight",
            })
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

    //删除方法
    function deleteMethod(item) {
        console.log(item.id)
        //过滤掉要除去的item
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`http://localhost:5000/news/${item.id}`)
    }

    return (
        // pagination设置分页
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    )
}

