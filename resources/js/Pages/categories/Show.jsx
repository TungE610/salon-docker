import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, notification, Modal, Tag, Tooltip, Space, Table, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, EyeOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import Highlighter from 'react-highlight-words';
import { useLang } from '../../Context/LangContext';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import CustomTable from '@/Components/CustomeTable';
const { Text } = Typography;

export default function DetailCategory (props) {
    const { lang } = useLang();
    const { Search } = Input;

    const [category, setCategory] = useState(props[0].category);
    const [products, setProducts] = useState(props[0].category.products);
    const [searchValue, setSearchValue] = useState('');
    const [deletedProductId, setDeletedProductId] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
        setProducts(props[0].category.products.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.unit.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.description.toLowerCase().includes(searchValue.toLowerCase())
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
            title: lang.get('strings.Unit'),
            dataIndex: 'unit',
            ...getColumnSearchProps('unit'),
            filters: [
                {
                  text: 'Joe',
                  value: 'Joe',
                },
                {
                  text: 'Jim',
                  value: 'Jim',
                },
                {
                  text: 'Submenu',
                  value: 'Submenu',
                },
            ],
            onFilter: (value, record) => record.unit === value,
        },
        {
            title: lang.get('strings.Cost-Per-Unit'),
            dataIndex: 'cost',
            sorter: (a, b) => a.cost - b.cost,
            ...getColumnSearchProps('cost'),
        },
        {
            title: lang.get('strings.Description'),
            dataIndex: 'description',
            align: 'center',
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
                                    <EditOutlined style={{ fontSize: 19 }} onClick={() => { editProduct(record.id) }} />
                                </Tooltip>
                                <Tooltip title="View">
                                    <EyeOutlined style={{ fontSize: 19 }} onClick={
                                        () => {
                                            Inertia.get(route('products.show', record, {
                                                onError: () => {},
                                                onSuccess: () => {},
                                            }))
                                        }} />
                                </Tooltip>
                                <Tooltip title="Inactive">
                                    <MinusCircleOutlined style={{ fontSize: 19 }} onClick={() => {showModal(record.id)}} />
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
        setDeletedProductId(id);
        setIsDeleteModalOpen(true);
    };

    const handleOk = () => {
        Inertia.put(route('products.inactive', { product: deletedProductId }), {}, {
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

    const editCategory = (e) => {
        
    };

    const showDeleteModal = (record) => {
        const modalDelete = Modal.warning();
        modalDelete.update({
            title: lang.get('strings.Delete-Category'),
            closable: true,
            okText: lang.get('strings.Delete'),
            onOk: () => handleOkDeleteModal(modalDelete, record),
            content:(
                <>
                    <h2 style={{color: '#FF3355'}}>{lang.get('strings.Delete-Category-Confirm')}</h2>
                    <h4>
                        <b>{lang.get('ID')}:</b> {record.id}
                    </h4>
                    <h4>
                        <b>{lang.get('Name')}:</b> {record.name}
                    </h4>
                </>
            ),
        })
    };
  
    const handleOkDeleteModal = (modalDelete, record) => {
        modalDelete.destroy();
        deleteCategory(record);
    };

    const deleteCategory = (record) => {
        Inertia.delete(route('categories.destroy', { category: category.id }), record, {
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
        });
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Salon Detail" />
            <Modal
                title="Delete Product"
                open={isDeleteModalOpen}
                onOk={() => { handleOk() }}
                onCancel={handleCancel}
            >
                <p className="font-semibold text-xl text-rose-600 leading-tight">Are you sure to delete this product ?</p>
            </Modal>
            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full flex justify-between items-start'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>Category Detail: {category.name}</h2>
                    <div className="px-4 sm:px-6">
                        <div className='flex justify-end'>
                            <div className='flex space-x-4'>
                                <a href={route('categories.edit', {category : category.id})}>
                                    <Button shape="round" size={'large'} onClick={editCategory} style={{ backgroundColor: '#1C274C', color: '#fff', fontWeight: 'bold', fontSize: 'large'}}>
                                        <div className="flex items-center gap-3 font-bebas tracking-wider text-lg">
                                            <EditOutlined />
                                            {lang.get('strings.Edit')}
                                        </div>
                                    </Button>
                                </a>
                                <Button danger shape="round" size={'large'} onClick={() => showDeleteModal(category)} style={{ backgroundColor: 'rgba(245, 39, 39, 0.79)', color: '#fff', fontWeight: 'bold', fontSize: 'large'}}>
                                    <div className="flex items-center gap-3 font-bebas tracking-wider text-lg">
                                        <DeleteOutlined />
                                        {lang.get('strings.Delete')}
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div> 
                <div className="bg-white w-full overflow-hidden mt-16">
                    <div className="px-4 py-7 sm:px-6">
                        <div className='flex justify-between'>
                            <h3 className="font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight ml-2" >
                                {lang.get('strings.Products')} List
                            </h3>
                            <div className='flex items-center space-x-4'>
                                <Button
                                    shape="round"
                                    size={"large"}
                                    onClick={createProduct}
                                    style={{ backgroundColor: '#1C274C', color: '#fff', fontWeight: 'bold', fontSize: 'large'}}
                                >
                                    <div className="flex items-center gap-3 font-bebas tracking-wider text-lg">
                                        <PlusCircleOutlined />
                                        {lang.get('strings.Create-Product')}
                                    </div>
                                </Button>
                                <Search placeholder="input id, name, description or unit"
                                    onChange={searchChangeHandler}
                                    enterButton
                                    bordered
                                    size="medium"
                                    allowClear
                                    style={{
                                        width: 304,
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                    <div >
                        <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                            <CustomTable
                                columns={columns}
                                dataSource={products}
                                onChange={onTableChange}
                                summary={() => {
                                    return (
                                      <>
                                        <Table.Summary.Row>
                                          <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                          <Table.Summary.Cell index={1}>
                                            <Text type="success">{products.length}</Text>
                                          </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                      </>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
