import React from 'react'
import { Table } from 'antd';

export default function NewsPublish(props) {

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'categoryId',
            render: (categoryId) => {
                return <div>{categoryId}</div>
            }

            // dataIndex: 'category',
            // render: (category) => {
            //     return <div> {category.title}</div>
            // }
        },
        {
            title: '操作',
            //传入的item为该项自身
            render: (item) => {
                return <div>
                    {props.button(item.id)}
                </div>
            }
        }
    ];

    return (
        // pagination设置分页
        <Table dataSource={props.dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />
    )
}

