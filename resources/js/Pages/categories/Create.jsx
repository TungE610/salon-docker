import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Form, Input, Radio, Button, notification } from 'antd';
import { useLang } from '../../Context/LangContext';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Create(props) {
    const { lang } = useLang();
    const [form] = Form.useForm();
    const categoryActives = props[0].category_active;

    const actives_option = categoryActives.map(
        (active_option, index) => {
            return {
                label: active_option,
                value: index,
            }
        }
    )

    const [valueActive, setValueActive] = useState(1);
    const onChangeActive = ({ target: { value } }) => {
        setValueActive(value);
    };

    const layout = {
        labelCol: {
            span: 1,
        },
        wrapperCol: {
            span: 12,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 1,
            span: 12,
        },
    };

    const onFinish = (values) => {
        Inertia.post(route('categories.store'), values, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Created'),
                    lang.get('strings.Category-Created-Noti')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.store
                );
            }
        })
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Edit User" />

            <div className="py-6">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    <h3 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight mb-12'>
                        {lang.get('strings.Create-Category')}
                    </h3>
                    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                        <Form.Item
                            name="name"
                            label= {lang.get('strings.Name')}
                            rules={[
                                {
                                    required: true,
                                    message: lang.get('strings.Input-Category-Name-Err'),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            label={lang.get('strings.Active')}
                            name = "active"
                            required
                            initialValue={valueActive}
                        >
                            <Radio.Group options={actives_option} onChange={onChangeActive} value={valueActive} optionType="button" />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                {lang.get('strings.Create')}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Authenticated>
    );
}
