import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Tag, notification } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'

export default function AuditList() {
    const navigate = useNavigate()

    const [dataSource, setDataSource] = useState([])

    const { username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        axios(`http://localhost:5000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            // console.log(res.data)
            setDataSource(res.data)
        }
        )
    }, [username])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            // 加粗
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author'
        },
        {
            title: '新闻分类',
            // dataIndex: 'categoryId',
            // render: (categoryId) => {
            //     return <div>{categoryId}</div>
            // }
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ['purple', 'orange', 'green', 'red']
                const auditList = ['草稿箱', '审核中', '已通过', '未通过']
                // const publishList = ['未发布', '待发布', '已发布', '已下线']

                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }

        },
        {
            title: '操作',
            //传入的item为该项自身
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button onClick={() => handleRervert(item)}>撤销</Button>
                    }
                    {
                        item.auditState === 2 && <Button danger onClick={() => handlePublish(item)}>发布</Button>
                    }
                    {
                        item.auditState === 3 && <Button type='primary' onClick={() => handleUpdate(item)}>更新</Button>
                    }
                </div>
            }
        }
    ];

    function handleRervert(item) {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`http://localhost:5000/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            notification.info({
                message: `提示`,
                description:
                    '您可以在草稿箱中查看您的新闻',
                placement: "bottomRight",
            })
        })
    }

    function handleUpdate(item) {
        navigate(`/news-manage/update/${item.id}`)
    }

    function handlePublish(item) {
        axios.patch(`http://localhost:5000/news/${item.id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            navigate('/publish-manage/published')
            notification.info({
                message: `提示`,
                description:
                    `您可以在已经发布中查看您的新闻`,
                placement: "bottomRight",
            })
        })
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
        </div>
    )
}
