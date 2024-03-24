import React, { useState, useEffect } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Form, Input, Select, Button, notification, Switch } from 'antd';
import { useLang } from '../../Context/LangContext';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';

export default function Create(props) {
    const { lang } = useLang();
    const [form] = Form.useForm();
    const errorMessage = Object.values(props.errors).join('\n');

    const layout = {
        labelCol: {
            span: 2,
        },
        wrapperCol: {
            span: 12,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 2,
            span: 12,
        },
    };

    const onFinish = (values) => {
        if (values.is_active === false) {
            values.is_active = 0;
        } else if (values.is_active) {
            values.is_active = 1;
        }

        Inertia.post(route('products.store'), values, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Created'),
                    lang.get('strings.Product-Created-Noti')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    errorMessage
                );
            }
        })
    };

    const categoryOptions = [];

    props[0].categories.forEach((role) => {
        categoryOptions.push({
            label: role.name,
            value: role.id,
        })
    });

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
            <Head title="Create Product" />

            <div className="py-6">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    <h3 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight mb-12'>
                        {lang.get('strings.Create-Product')}
                    </h3>
                    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="cost"
                            label="Cost"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="unit"
                            label="Unit"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="quantity"
                            label="Quantity"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="category"
                            label="Category"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={categoryOptions}
                            />
                        </Form.Item>
                        <Form.Item
                            name="is_active"
                            label="Active"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Switch />
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
