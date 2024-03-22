import React, { useState, useEffect, useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, useForm } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import Highlighter from 'react-highlight-words';
import { Checkbox, Input, Modal, notification, Button, Form, Space, Typography, Popconfirm, Table } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusCircleOutlined, ExportOutlined, ImportOutlined, SearchOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import 'antd/dist/antd.css';
import {CSVLink} from "react-csv"

export default function Staffs(props) {

    const initialData = props[0].customers.map(customer => { return {key: customer.id, ...customer, created_at: customer.created_at.replace("T", " ").replace("Z", "").replace(/\.?0+$/, '').replace(/\.$/, '')}})
    const [customers, setCustomers] = useState(initialData);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [isActive, setIsActive] = useState(false);
    const { lang } = useLang();
    const { confirm } = Modal;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [modalTitle, setModalTitle] = useState('');
    const [editMode, setEditMode] = useState(false);
    const { Search } = Input;
    const [searchValue, setSearchValue] = useState('');
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    useEffect(() => {
        setCustomers(props[0].customers.filter(item => (
            item.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.phone_number.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const filters_active = [
        { text: lang.get('strings.Yes'), value: true },
        { text: lang.get('strings.No'), value: false },
    ];

    const showModal = () => {
        setModalTitle(lang.get('strings.Modal-Create-Customer'))
        setIsModalOpen(true);
    };

    const handleEditOk = (values) => {
        Inertia.put(route('customers.update', { customer: values.id }), { ...values }, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Edited'),
                    lang.get('strings.Successfully-Edited-Customer')
                );
            },
        });

        setIsModalOpen(false);
        setEditMode(false);
    }

    const handleSubmitModal = (values) => {
        if (editMode) {
            handleEditOk(values);
        } else {
            setPhoneNumber(values.phone);
            setName(values.full_name);
            setIsActive(values.is_active);
            Inertia.post(route('customers.sendOTP'), { phoneNumber: values.phone }, {
                onError: () => { },
                onSuccess: () => { },
            });
            setOtpModalOpen(true);
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditMode(false);
    };

    // const showModalEditCustomer = (values) => {
    //     setEditMode(true);
    //     setModalTitle(lang.get('strings.Modal-Edit-Customer'))
    //     setIsModalOpen(true);
    //     form.setFieldsValue(values);
    // };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: lang.get('strings.Delete-Customer'),
            icon: <ExclamationCircleOutlined />,
            content: (
                <>
                    <h2 className="text-rose-600">{lang.get('strings.Message-Confirm-Delete')}</h2>
                    <h4>
                        <b>{lang.get('strings.Customer-Name')}:</b> {record.full_name}
                    </h4>
                    <h4>
                        <b>{lang.get('strings.Customer-Phone')}:</b> {record.phone}
                    </h4>
                </>
            ),
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                Inertia.delete(route('customers.destroy', { customer: record.id }), {
                    onSuccess: () => {
                        openNotification('success',
                            lang.get('strings.Successfully-Deleted'),
                            lang.get('strings.Successfully-Deleted-Customer'),
                        );
                    },

                    onError: () => {
                        openNotification('error',
                            lang.get('strings.Somethings-went-wrong'),
                            lang.get('strings.Error-When-Update-To-DB')
                        );
                    }
                });
            },
            onCancel() {
            },
        });
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 10,
            span: 16,
        },
    };

    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
      form.setFieldsValue({
        full_name: '',
        // age: '',
        address: '',
        ...record,
      });
      setEditingKey(record.key);
    };

    const cancel = () => {
      setEditingKey('');
    };
    const save = async (key) => {
      try {
        const row = await form.validateFields();
        const newData = [...customers];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          Inertia.put(route('customers.update', { customer: index + 1 }), { ...newData }, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Edited'),
                    lang.get('strings.Successfully-Edited-Customer')
                );
            },
        });
          setCustomers(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setCustomers(newData);
          setEditingKey('');
        }
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                close
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#3d5c98' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),

        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },

        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            {text}
          ),
      });
  

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
            key: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Fullname',
            dataIndex: 'full_name',
            // sorter: (a, b) => a.full_name.localeCompare(b.full_name),
            key: 'full_name',
            ...getColumnSearchProps('full_name'),
        },
        {
          title: 'Dob',
          dataIndex: 'dob',
          key: 'dob',
          width: 130,
        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          key: 'gender',
          width: 100,
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone_number',
            width: 250,
            sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),
            key: 'phone_number',
            editable: true,
        },
        {
            title: lang.get('strings.Active'),
            align: 'center',
            width: 220,
            filters: filters_active,
            onFilter: (value, record) => {
                if (record.is_active == value) {
                    return true;
                }
            },
            render: (record) => {
                return (
                    <Checkbox checked={record.is_active} />
                )
            },
            key: 'active',
            editable: true,
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            width: 220,
            key: 'created_at',
            ...getColumnSearchProps('created_at'),
        },
        {
            title: lang.get('strings.Action'),
            align: 'center',
            width: 150,
            render: (text, record) => {

                return (
                    <div className="flex gap-3 justify-center">
                        <Button icon={  <EditOutlined style={{ fontSize: 17, color: '#fff' }} onClick={
                            () => {
                                // showModalEditCustomer(record);
                                edit(record);
                            }} />}>

                        </Button>
                        <Button icon={<EyeOutlined style={{ fontSize: 19, color: '#000' }} onClick={
                            () => {
                                Inertia.get(route('customers.show', { customer: record.id }));
                            }} />
                        }>
                        </Button>
                        <Button icon={<DeleteOutlined style={{ fontSize: 19, color: '#fff' }} onClick={() => {
                            showDeleteConfirm(record)
                        }} />}>
                            
                        </Button>
                    </div>
                )
            },
            key: 'action',
        },
    ];

    const exportExcel = () => {

    }

    const onTableChange = (pagination, filters, sorter, extra) => { };

    const checkOTP = (values) => {
        Inertia.post(route('customers.checkOTP'), { OTP: values.OTP, phoneNumber, full_name, isActive: isActive }, {
            onSuccess: (response) => {
                openNotification('success',
                    lang.get('strings.Successfully-Created'),
                    lang.get('strings.Successfully-Created-Customer')
                );
            },
            onError: (error) => {
            }
        })
        setOtpModalOpen(false);
        setIsModalOpen(false);
    }

    const otpModalClose = () => {
        setOtpModalOpen(false);
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.List-Customers')}</h2>}
        >
            <Head title={lang.get('strings.List-Customers')} />

            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>{lang.get('strings.List-Customers')}</h2>
                </div>
                <div className="flex gap-4 justify-between w-full mr:3 mb-8 sm:px-6 lg:px-8 mt-12">      
                    <Button style={{ backgroundColor: '#1C274C', color: '#fff', fontWeight: 'bold' }} shape="round" size="large" onClick={showModal}>
                        <div className="flex items-center gap-3 font-bebas tracking-wide text-lg">
                            <PlusCircleOutlined />
                            {lang.get('strings.Create-Customer')}
                        </div>
                    </Button>
                    <div className="flex gap-4">
                        <Button style={{ backgroundColor: '#1C274C', color: '#fff', fontWeight: 'bold' }} shape="round" size="large" onClick={exportExcel}>
                            <div className="flex items-center gap-3 font-bebas text-lg tracking-wider">
                                <ExportOutlined />
                                <CSVLink
                                    filename={"Customer.csv"}
                                    data={customers}
                                    className="text-white"
                                    separator={";"}
                                >
                                Export
                                </CSVLink>
                            </div>
                        </Button>
                        <Button style={{ backgroundColor: '#1C274C', color: '#fff', fontWeight: 'bold' }} shape="round" size="large" onClick={exportExcel}>
                            <div className="flex items-center gap-3 font-bebas text-lg tracking-wider">
                                <ImportOutlined />
                                Import
                            </div>
                        </Button>
                        <Search placeholder="input name or phone number" onChange={searchChangeHandler}
                            enterButton bordered size="large" allowClear style={{ width: 304 }} />
                    </div>
                </div>
                <div className="flex justify-end px-8">
                    <Modal title="OTP" open={otpModalOpen} onCancel={otpModalClose} footer={null}>
                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: 600,
                            }}
                            onFinish={checkOTP}
                        >
                            <Form.Item
                                label="sent OTP"
                                name="OTP"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input sent otp!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit">
                                    {lang.get('strings.Submit')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal title={modalTitle} open={isModalOpen} onCancel={handleCancel} footer={null}>
                        <Form {...layout} form={form} name="control-hooks" onFinish={handleSubmitModal}>
                            <Form.Item name="id" className="hidden">
                                <Input hidden={true} />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label='Fullname'
                                rules={[
                                    {
                                        required: true,
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="phone"
                                label='Phone Number'
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="is_active" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                <Checkbox> {lang.get('strings.Active-Account-Customer')} </Checkbox>
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button key="back" className="mr-4" >
                                    {lang.get('strings.Cancel')}
                                </Button>
                                <Button htmlType="submit" type="primary">
                                    {lang.get('strings.Submit')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                      bordered
                      columns={columns} // Use mergedColumns instead of columns
                      dataSource={initialData}
                  />
                </div>
            </div>
        </Authenticated>
    );
}
