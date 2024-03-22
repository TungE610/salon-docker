import React, { useState, useEffect, useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, notification, Tag, Button, Tooltip, Space, Badge, Table, Typography } from 'antd';
import { EditOutlined, EyeOutlined, PlusCircleOutlined, DeleteOutlined, SearchOutlined} from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia';
import Highlighter from 'react-highlight-words';
const { Text } = Typography;

import 'antd/dist/antd.css';

export default function Categories(props) {

    const [categories, setCategories] = useState(props[0].categories);
    const [searchValue, setSearchValue] = useState('');
    const [deletedCategoryId, setDeletedCategoryId] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { lang } = useLang();
    const { Search } = Input;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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
            color: filtered ? '#1677ff' : undefined,
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
          text
        ),
    });
    useEffect(() => {
        setCategories(props[0].categories.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const columns = [
        {
            title: lang.get('strings.ID'),
            dataIndex: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: lang.get('strings.Name'),
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: lang.get('strings.Product-Type'),
            dataIndex: 'product_type',
            sorter: (a, b) => a.product_type - b.product_type,
        },
        {
            title: lang.get('strings.Product-Number'),
            dataIndex: 'product_number',
            sorter: (a, b) => a.product_number - b.product_number,
        },
        {
            title: lang.get('strings.Active'),
            dataIndex: 'is_active',
            filters: [
                {
                  text: 'Active',
                  value: "True",
                },
                {
                  text: 'Inactive',
                  value: "False",
                },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (value, record) => {
                if (value === "True") {
                    return <Badge status="success" text="Active" />
                } else {
                    return <Badge status="error" text="Inactive" />
                }
            }
        },
        {
            title: lang.get('strings.Action'),
            align: 'center',
            filters: [
                {
                    text: 'False',
                    value: 'False',
                },
                {
                    text: 'True',
                    value: 'True',
                },
            ],
            onFilter: (value, record) => record.is_active === value,
            render: (text, record) => {
                return (
                    <div>
                        {record.is_active === 'False' ?
                            <div>
                                <Tag color="#f50">{lang.get('strings.Inactive')}</Tag>
                            </div> :
                            <div className="flex gap-3 justify-center">
                                <Tooltip title="Edit">
                                    <EditOutlined style={{ fontSize: 19, color: '#1c5dfd' }} onClick={() => { editCategory(record.id) }} />
                                </Tooltip>
                                <Tooltip title="View">
                                    <EyeOutlined style={{ fontSize: 19 }} onClick={
                                        () => {
                                            Inertia.get(route('categories.show', record, {
                                                onError: () => { },
                                                onSuccess: () => { },
                                            }))
                                        }} />
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => showModal(record.id)} />
                                </Tooltip>
                            </div>
                        }
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => { };

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const showModal = (id) => {
        setDeletedCategoryId(id);
        setIsDeleteModalOpen(true);
    };

    const handleOk = () => {
        Inertia.delete(route('categories.destroy', { category: deletedCategoryId }), {}, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Delete'),
                    lang.get('strings.Category-Deleted-Noti')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.unactive
                );
            }
        })

        setIsDeleteModalOpen(false);
    };

    const handleCancel = () => {
        setIsDeleteModalOpen(false);
    };

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const editCategory = (id) => {
        Inertia.get(route('categories.edit', { category: id }))
    }

    const createCategory = () => {
        Inertia.get(route('categories.create'))
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Dashboard" />
            <Modal
                title= {lang.get('strings.Delete-Category')}
                open={isDeleteModalOpen}
                onOk={() => { handleOk() }}
                onCancel={handleCancel}
            >
                <p className="font-semibold text-xl text-rose-600 leading-tight">{lang.get('strings.Delete-Category-Confirm')}</p>
            </Modal>
            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>{lang.get('strings.Categories')}</h2>
                </div>
                <div className="flex gap-4 justify-between w-full mr:3 mb-4 sm:px-6 lg:px-8 mt-12">
                    <Button
                        shape="round"
                        size={"large"}
                        style={{ backgroundColor: '#1C274C', color: '#fff', fontWeight: 'bold', fontSize: 'large'}}
                        onClick={createCategory}
                    >
                        <div className="flex items-center gap-3 font-bebas tracking-wider text-lg">
                            <PlusCircleOutlined />
                            {lang.get('strings.Create-Category')}
                        </div>
                    </Button>
                    <Search placeholder="input id, name"
                        onChange={searchChangeHandler}
                        enterButton
                        bordered
                        size="medium "
                        allowClear
                        style={{
                            width: 304,
                        }}
                    />
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        columns={columns}
                        dataSource={categories}
                        onChange={onTableChange}
                        summary={() => {
                            return (
                              <>
                                <Table.Summary.Row>
                                  <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                  <Table.Summary.Cell index={1}>
                                    <Text type="success">{categories.length}</Text>
                                  </Table.Summary.Cell>
                                </Table.Summary.Row>
                              </>
                            );
                        }}
                    />
                </div>
            </div>
        </Authenticated>
    );
}
