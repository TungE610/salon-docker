import React, { useState, useRef } from 'react';
import { Badge, notification, Modal, Table, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useLang } from '../../Context/LangContext';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import Highlighter from 'react-highlight-words';
import { Inertia } from '@inertiajs/inertia';

export default function DetailSalon(props) {
    const { lang } = useLang();
    const [staffs, setStaffs] = useState(props.staffs.map(staff => {
        return {
            ...staff,
            full_name: `${staff.first_name} ${staff.last_name}`
        }
    }));
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
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          width: 80,
          ...getColumnSearchProps('id'),
        },
        {
            title: 'Full name',
            key: 'full name',
            dataIndex: 'full_name',
            // render: (record) => {
            //     return (
            //         <div>{record.first_name} {record.last_name}</div>
            //     )
            // },
            ...getColumnSearchProps('full_name'),
          },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          ...getColumnSearchProps('email'),
        },
        {
          title: 'Phone Number',
          dataIndex: 'phone_number',
          key: 'phone_number',
          ...getColumnSearchProps('phone_number'),
        },
        {
            title: 'Role',
            key: 'salon_role',
            render: (record) => {
                return (<div>
                    {
                        record.salon_roles.map(role => <div>{role.name}</div>)
                    }
                </div>
                )
            },
            filters: [
                {
                    text: 'Manager',
                    value: 'manager',
                },
                {
                    text: 'Cashier',
                    value: 'cashier',
                },
                {
                    text: 'Barber',
                    value: 'barber',
                },
                {
                    text: 'Hairdresser',
                    value: 'hairdresser',
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.salon_roles.map(role => role.name).includes(value),
          },
          {
            title: "Active",
            dataIndex: 'is_active',
            render: (value, record) => {
                if (value === 1) {
                    return <Badge status="success" text="Active" />
                } else {
                    return <Badge status="error" text="Inactive" />
                }
            }
          }
      ];

    const showDeleteModal = (record) => {
        const modalDelete = Modal.warning();
        modalDelete.update({
            title: lang.get('strings.Delete-Salon'),
            closable: true,
            okText: lang.get('strings.Delete'),
            onOk: () => handleOkDeleteModal(modalDelete, record),
            content: (
                <>
                    <h2 style={{ color: '#FF3355' }}>{lang.get('strings.Confirm-Delete-Salon')}</h2>
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
            <Head title="Salon Detail" />
            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>Salon Staff</h2>
                </div>
                <div className="bg-white w-full overflow-hidden sm:rounded-lg">
                    <div className="sm:px-6 lg:px-8 py-7 sm:px-6">
                        <div className='flex justify-between items-center'>
                            <div className="text-2xl leading-6 font-bebas tracking-wide text-sky-900 max-w-2xl ">
                                {/* {salon.name} */}
                            </div>
                            <div className='flex space-x-4'>
                                {/* <Button danger type="primary" shape="round" size={'large'} onClick={() => showDeleteModal(salon)} style={{backgroundColor: 'rgb(239 68 68)', borderColor: 'rgb(220 38 38)', color: 'white'}} >
                                    {lang.get('strings.Delete')}
                                </Button> */}
                            </div>
                        </div>
                    </div>
                    <div className="sm:px-6 lg:px-8 mt-2">
                        <Table columns={columns} dataSource={staffs} />
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
