import React from 'react'
import { Button } from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function UnPublished() {
    //1===待发布
    const { dataSource, handlePublish } = usePublish(1)
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => { handlePublish(id) }}>发布</Button>}></NewsPublish>
        </div>
    )
}