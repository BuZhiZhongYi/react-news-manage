import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Tag, notification } from 'antd'
import axios from 'axios'

export default function Audit() {
    const navigate = useNavigate()

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
    const [dataSource, setDataSource] = useState([])

    const roleObj = {
        '1': 'superadmin',
        '2': 'admin',
        '3': 'editor'
    }

    useEffect(() => {
        axios.get("http://localhost:5000/news?auditState=1&_expand=category").then(res => {
            const list = res.data
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[roleId] === 'editor')
            ])
        })
    }, [roleId, username, region])

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
                    <Button type='primary' onClick={() => { handleAudit(item, 2, 1) }}>通过</Button>&nbsp;&nbsp;
                    <Button danger onClick={() => { handleAudit(item, 3, 0) }}>拒绝</Button>
                </div>
            }
        }
    ]

    function handleAudit(item, auditState, publishState) {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`http://localhost:5000/news/${item.id}`, {
            auditState,
            publishState
        }).then(res => {

            notification.info({
                message: `提示`,
                description:
                    '您可以在审核列表中查看您的新闻',
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
