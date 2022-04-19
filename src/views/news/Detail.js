import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd';
import { HeartTwoTone } from '@ant-design/icons'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';

export default function Detail() {

    const [newsInfo, setNewsInfo] = useState(null)

    const { id } = useParams()
    useEffect(() => {
        axios.get(`http://localhost:5000/news/${id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`http://localhost:5000/news/${id}`, {
                view: res.view + 1
            })
        })
    }, [id])

    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已发布', '已下线']
    const colorList = ['purple', 'orange', 'green', 'red']

    function handleStar() {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`http://localhost:5000/news/${id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        <div>
            {
                newsInfo && <div>
                    <PageHeader
                        onBack={() => window.history.back()}
                        //axios异步请求会出错
                        title={newsInfo.title}
                        subTitle={
                            <div>
                                {newsInfo.category ? newsInfo.category.title : newsInfo.categoryId} &nbsp;
                                <HeartTwoTone twoToneColor="#eb2f96" onClick={() => { handleStar() }} />
                            </div>
                        }
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss") : "-"}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量"><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                            <Descriptions.Item label="点赞数量"><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ margin: '24px', border: "1px solid black", height: "580px", overflow: 'auto' }} />

                </div>
            }
        </div>
    )
}

