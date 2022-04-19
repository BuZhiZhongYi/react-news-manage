import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select

//forwardRef可以实现父组件获取子组件的ref
const UserForm = forwardRef((props, ref) => {

    const [isDisabled, setIsDisabled] = useState(false)

    const { roleList, regionList, isUpdateDisabled } = props

    useEffect(() => {
        setIsDisabled(isUpdateDisabled)
    }, [isUpdateDisabled])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        '1': 'superadmin',
        '2': 'admin',
        '3': 'editor'
    }

    function checkRegionDisabled(item) {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return roleObj[item.id] !== 'editor'
            }
        }
    }

    function checkRoleDisabled(item) {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return item.roleId !== 3
            }
        }
    }
    return (
        <Form layout="vertical" ref={ref}>
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={isDisabled}>
                    {
                        regionList.map((item) => {
                            return <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
                        })
                    }
                </Select>
            </Form.Item>

            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select onChange={(value) => {
                    if (value === 1) {
                        setIsDisabled(true)
                        ref.current.validateFields({
                            region: ''
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {
                        roleList.map((item) => {
                            return <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm