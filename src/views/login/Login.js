import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Login.css'

export default function Login() {

    const navigate = useNavigate()

    // 用于收集输入的信息 密码用户名
    function onFinish(values) {
        const { username, password } = values
        // console.log(values)
        axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            // console.log(res.data)
            if (res.data.length > 0) {
                localStorage.setItem('token', JSON.stringify(res.data[0]))
                navigate('/')
            } else {
                message.error("用户名或密码不正确")
            }
        })
    }

    return (
        <div style={{ 'backgroundColor': 'rgb(35,39,65)', 'height': '100%' }}>
            <div className='formContainer'>
                <div className='loginTitle'>后台管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>

                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
