import React from 'react'
import SideMenu from '../../components/sandBox/SideMenu'
import TopHeader from '../../components/sandBox/TopHeader'
import { Layout } from 'antd'
import './NewSandBox.css'
import NewsRouter from '../../components/sandBox/newsRouter'



const { Content } = Layout;

export default function NewSandBox() {
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />

                <Content className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}
                >
                    <NewsRouter></NewsRouter>
                </Content>

            </Layout>

        </Layout>
    )
}
