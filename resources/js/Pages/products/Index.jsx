import React, { useState, useEffect, useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, notification, Button, Tooltip, Space } from 'antd';
import { EditOutlined, EyeOutlined, PlusCircleOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia';
import Highlighter from 'react-highlight-words';
import 'antd/dist/antd.css';

export default function Products(props) {

    const [products, setProducts] = useState(props[0].products);
    const [searchValue, setSearchValue] = useState('');
    const [deletedProductId, setDeletedProductId] = useState(0);
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
        setProducts(props[0].products.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.unit.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.category.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            ...getColumnSearchProps('id'),
        },
        {
            title: lang.get('strings.Name'),
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: lang.get('strings.Category'),
            dataIndex: 'category',
            ...getColumnSearchProps('category'),
        },
        {
            title: lang.get('strings.Unit'),
            dataIndex: 'unit',
            ...getColumnSearchProps('unit'),
        },
        {
            title: lang.get('strings.Cost-Per-Unit'),
            dataIndex: 'cost',
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: lang.get('strings.Description'),
            dataIndex: 'description',
            width: 600,
            ...getColumnSearchProps('description'),
        },
        {
            title: lang.get('strings.Quantity'),
            dataIndex: 'quantity',
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: lang.get('strings.Action'),
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
                        <div className="flex gap-3 justify-center">
                            <Tooltip title="Edit">
                                <EditOutlined style={{ fontSize: 19, color: '#1c5dfd' }} onClick={() => { editProduct(record.id) }} />
                            </Tooltip>
                            <Tooltip title="View">
                                <EyeOutlined style={{ fontSize: 19 }} onClick={
                                    () => {
                                        Inertia.get(route('products.show', record, {
                                            onError: () => { },
                                            onSuccess: () => { },
                                        }))
                                    }} />
                            </Tooltip>
                            <Tooltip title="Inactive">
                                <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => { showModal(record.id) }} />
                            </Tooltip>
                        </div>
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
        setDeletedProductId(id);
        setIsDeleteModalOpen(true);
    };

    const handleOk = () => {
        Inertia.delete(route('products.destroy', { product: deletedProductId }), {}, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Delete'),
                    lang.get('strings.Product-Deleted-Noti')
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

    const createProduct = () => {
        Inertia.get(route('products.create'));
    }

    const editProduct = (id) => {
        Inertia.get(route('products.edit', { product: id }));
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Dashboard" />
            <Modal
                title="Delete Product"
                open={isDeleteModalOpen}
                onOk={() => { handleOk() }}
                onCancel={handleCancel}
            >
                <p className="font-semibold text-xl text-rose-600 leading-tight">Are you sure to delete this product ?</p>
            </Modal>
            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>{lang.get('strings.Products')}</h2>
                </div>
                <div className="flex justify-between w-full mr:3 mb-4 sm:px-6 lg:px-8 mt-12">
                    <Button
                        shape="round"
                        size={"large"}
                        style={{ backgroundColor: '#1C274C', color: '#fff', fontWeight: 'bold', fontSize: 'large'}}
                        onClick={createProduct}
                    >
                        <div className="flex items-center gap-3 font-bebas tracking-wider text-lg">
                            <PlusCircleOutlined />
                            {lang.get('strings.Create-Product')}
                        </div>
                    </Button>
                    <Search placeholder="input id, phone, email or name"
                        onChange={searchChangeHandler}
                        enterButton
                        bordered
                        size="medium"
                        allowClear
                        style={{
                            width: 304,
                        }} />

                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        columns={columns}
                        dataSource={products}
                        onChange={onTableChange}
                    />

                </div>
            </div>
        </Authenticated>
    );
}
