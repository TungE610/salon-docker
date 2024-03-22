import React, { useState, useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head, Link } from '@inertiajs/inertia-react';
import { Badge, notification, Modal, Input, Tooltip, Space, Button } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useLang } from '../../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Inertia } from '@inertiajs/inertia';
import Highlighter from 'react-highlight-words';
import 'antd/dist/antd.css';

export default function Salons(props) {
    const [salons, setSalons] = useState(props[0].salons.map(salon => {return {...salon, key: salon.id}}));
    const [searchValue, setSearchValue] = useState('');
    const { Search } = Input;
    const { lang } = useLang();
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
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: lang.get('strings.Salon-Name'),
            dataIndex: 'name',
            align: 'center',
            ...getColumnSearchProps('name'),
        },
        {
            title: lang.get('strings.Address'),
            dataIndex: 'address',
            align: 'center',
            ...getColumnSearchProps('address'),
        },
        {
            title: lang.get('strings.Owner-Email'),
            dataIndex: 'owner_email',
            align: 'center',
            ...getColumnSearchProps('owner_email'),
        },
        {
            title: 'Package',
            dataIndex: 'package',
            align: 'center',
            filters: [
                {
                  text: 'Big',
                  value: 'big',
                },
                {
                  text: 'Medium',
                  value: 'medium',
                },
                {
                  text: 'Small',
                  value: 'small',
                }
            ],
            onFilter: (value, record) => record.package === value,
        },
        {
            title: lang.get('strings.Staff-Number'),
            dataIndex: 'num_staffs',
            sorter: (a, b) => a.num_staffs - b.num_staffs,
            align: 'center'
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
            render: (text, record) => {
                return (
                    <div className='flex gap-2'>
                        <div className='pb-2'>
                            <Link href={route('salons.show', {salon : record})}>
                                <Tooltip title="View">
                                    <EyeOutlined style={{ fontSize: 19 }} />
                                </Tooltip>
                            </Link>
                        </div>
                        <div className='pb-2'>
                            <Tooltip title="Delete">
                                    <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} onClick={() => showDeleteModal(record)} />
                            </Tooltip>
                        </div>
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => {};

    const onSearch = (value, _e, info) => {
        setSearchValue(value);
        setSalons(setSalonSearchValue(value, searchValue));
    };

    const setSalonSearchValue = (value, valuePrev) => {
        if (valuePrev !== '' && value !== '') {
            const salonsSearched = [];
            props[0].salons.forEach( (salon) => {
                if (salon.id == value
                    || salon.name.includes(value)
                    || salon.owner_email.includes(value)
                ) {
                    salonsSearched.push(salon);
                };
            });
            return salonsSearched;
        } else {
            if (value === '') {
                return props[0].salons;
            } else {
                const salonsSearched = [];
                salons.forEach( (salon) => {
                    if (salon.id == value
                        || salon.name.includes(value)
                        || salon.owner_email.includes(value)
                    ) {
                        salonsSearched.push(salon);
                    };
                });
                return salonsSearched;
            }
        }
    };

    const showDeleteModal = (record) => {
        const modalDelete = Modal.warning();
        modalDelete.update({
            title: "Delete Salon",
            closable: true,
            okText: "Delete",
            onOk: () => handleOkDeleteModal(modalDelete, record),
            content:(
                <>
                    <h2 style={{color: '#FF3355'}}>{lang.get('strings.Confirm-Delete-Salon')}</h2>
                    <h4>
                        <b>{lang.get('Salon-ID')}:</b> {record.id}
                    </h4>
                    <h4>
                        <b>{lang.get('Salon-Name')}:</b> {record.name}
                    </h4>
                </>
            ),
        })
    };

    const handleOkDeleteModal = (modalDelete, record) => {
        modalDelete.destroy();
        deleteSalon(record);
    };

    const deleteSalon = (record) => {
        Inertia.delete(route('salons.destroy', { salon: record.id }), record, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Deleted'),
                    lang.get('strings.Salon-Deleteted')
                );
            },
            onError: () => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    lang.get('strings.Error-When-Update-To-DB')
                );
            }
        });
    }

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
            <Head title="Salons" />
            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>{lang.get('strings.Salons')}</h2>
                </div>
                <div className="flex justify-end w-full mr:3 mb-8 sm:px-6 lg:px-8 mt-12">
                    <Search placeholder="input id, salon name, owner email"
                        onSearch={onSearch} enterButton bordered
                        size="large"
                        allowClear
                        style={{
                            width: 304,
                        }} />

                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <CustomTable
                        columns={columns}
                        dataSource={salons}
                        onChange={onTableChange} />
                </div>
            </div>
        </Authenticated>
    );
}
