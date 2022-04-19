import { useEffect, useState } from 'react'
import { notification } from 'antd'
import axios from 'axios'

function usePublish(type) {

    const { username } = JSON.parse(localStorage.getItem('token'))

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:5000/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            // console.log(res.data)
            setDataSource(res.data)
        })
    }, [username, type])

    function handlePublish(id) {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now()
        }).then(res => {
            notification.info({
                message: `提示`,
                description:
                    '您可以在已发布中查看您的新闻',
                placement: "bottomRight",
            })
        })
    }

    function handleSunset(id) {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`http://localhost:5000/news/${id}`, {
            "publishState": 3
        }).then(res => {
            notification.info({
                message: `提示`,
                description:
                    '您可以在已下线中查看您的新闻',
                placement: "bottomRight",
            })
        })
    }

    function handleDelete(id) {
        setDataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`http://localhost:5000/news/${id}`).then(res => {
            notification.info({
                message: `提示`,
                description:
                    '您已经删除了该条新闻',
                placement: "bottomRight",
            })
        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish