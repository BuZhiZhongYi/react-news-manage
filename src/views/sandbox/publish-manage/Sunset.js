import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {
    //3===已下线
    const { dataSource, handleDelete, handlePublish } = usePublish(3)

    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => {
                return <div>
                    <Button danger onClick={() => { handleDelete(id) }}>删除</Button>&nbsp;&nbsp;
                    <Button type='primary' onClick={() => { handlePublish(id) }}>重新上线</Button>
                </div>
            }
            }></NewsPublish>
        </div>
    )
}

