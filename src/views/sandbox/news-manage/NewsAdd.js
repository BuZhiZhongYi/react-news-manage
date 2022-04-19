import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Option } = Select
const { Step } = Steps

export default function NewsAdd() {
    const navigate = useNavigate()

    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")

    const NewsForm = useRef(null)

    useEffect(() => {
        axios.get('http://localhost:5000/categories').then(res => {
            setCategoryList(res.data)
            // console.log(res.data)
        })
    }, [])

    function handleNext() {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setformInfo(res)
                setCurrent(current + 1)
            }).catch(err => {
                console.log(err)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("内容不能为空")
            } else {
                setCurrent(current + 1)
            }
        }
    }
    function handlePrevious() {
        setCurrent(current - 1)
    }

    const User = JSON.parse(localStorage.getItem('token'))
    function handleSave(auditState) {
        axios.post('http://localhost:5000/news', {
            ...formInfo,
            "content": content,
            "region": User.region ? User.region : "全球",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
            notification.info({
                message: `提示`,
                description:
                    `您可以在${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                placement: "bottomRight",
            })
        })
    }

    return (
        <div>
            <PageHeader className='site-page-header'
                title="撰写新闻" />

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            <div style={{ 'marginTop': '50px' }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 30 }}
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Select>
                                {/* <Option value={'环球经济'} key={'环球经济'} defaultValue={'环球经济'}>环球经济</Option> */}
                                {
                                    categoryList.map(item => {
                                        return <Option value={item.id} key={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>

                <div className={current === 1 ? '' : style.active} >
                    <NewsEditor getContent={(value) => { setContent(value) }}></NewsEditor>
                </div>

                <div className={current === 2 ? '' : style.active}>

                </div>
            </div>

            <div style={{ 'marginTop': '50px' }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }

            </div>
        </div >
    )
}
