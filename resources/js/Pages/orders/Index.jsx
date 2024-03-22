import React, { useEffect, useState, useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';
import CustomTable from '@/Components/CustomeTable';
import { Input, Modal, notification, Badge, DatePicker, Select, Space, Button } from 'antd';
import { useLang } from '../../Context/LangContext';
import { DeleteOutlined, FileDoneOutlined, ExclamationCircleOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Inertia } from "@inertiajs/inertia";
const { RangePicker } = DatePicker;
import Highlighter from 'react-highlight-words';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'antd/dist/antd.css';
const localizer = momentLocalizer(moment) // or globalizeLocalizer

const viewModeOptions = [
    {
        value: 'list',
        label: 'View by list'
    },
    {
        value: 'calendar',
        label: 'View by calendar'
    },
];

const pickerTypeOptions = [
    {
        value: 'date',
        label: 'By Date'
    },
    {
        value: 'week',
        label: 'By Week'
    },
    {
        value: 'month',
        label: 'By Month'
    },
    {
        value: 'quarter',
        label: 'By Quarter'
    },
    {
        value: 'year',
        label: 'By Year'
    },
    {
        value: 'range',
        label: 'Date Range'
    },
]

export default function Index(props) {

    const [orders, setOrders] = useState(props[0].orders);
    const { lang } = useLang();
    const { confirm } = Modal;
    const [searchValue, setSearchValue] = useState('');
    const { Search } = Input;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pickerType, setPickerType] = useState('date');
    const [viewMode, setViewMode] = useState('list');
    
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
        setOrders(props[0].orders.filter(item => (
            item.serial.toString().includes(searchValue.toString()) ||
            item.customer === null ? true : item.customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.products.some((product) =>
                product.name.toLowerCase().includes(searchValue.toLowerCase())
            )
        )));
    }, [searchValue]);

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const filters_status = [
        { text: 'Prepare', value: 'prepare' },
        { text: 'In process', value: 'in process' },
        { text: 'Done', value: 'done' },
        { text: 'Cancel', value: 'cancel' },
    ];

    const filters_active = [
        { text: lang.get('strings.Yes'), value: true },
        { text: lang.get('strings.No'), value: false },
    ];

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const orderStatusChange = (orderId, value) => {
        Inertia.put(route('orders.update', { order: orderId , status: value}), {} , {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Updated'),
                    lang.get('strings.Order-Successfully-Updated')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.update,
                );
            },
        });
    }

    const showDeleteConfirm = (id) => {
        confirm({
            title: lang.get('strings.Delete-Order'),
            icon: <ExclamationCircleOutlined />,
            content: lang.get('strings.Message-Confirm-Delete'),
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                Inertia.delete(route('orders.destroy', { order: id }), {
                    onSuccess: () => {
                        openNotification('success',
                            lang.get('strings.Successfully-Deleted'),
                            lang.get('strings.Order-Deleted'),
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

    const columns = [
        {
            title: lang.get('strings.Serial'),
            dataIndex: 'serial',
            ...getColumnSearchProps('serial'),
        },
        {
            title: lang.get('strings.Customer-Name'),
            dataIndex: 'customer',
            ...getColumnSearchProps('customer'),
        },
        {
            title: lang.get('strings.Time-Order'),
            dataIndex: 'time_arrive',
        },
        // {
        //     title: lang.get('strings.Ordered-Product'),
        //     render: (_, { products }) => (
        //         <>
        //             {products.map(product => product.name).map((productName) => {
        //                 return (
        //                     <Tag key={productName} color="#4a98ff">
        //                         {productName}
        //                     </Tag>
        //                 );
        //             })}
        //         </>
        //     )

        // },
        {
            title: lang.get('strings.Status'),
            dataIndex: 'status',
            filters: filters_status,
            onFilter: (value, record) => record.status === value,
            render: (_, record ) => {
                return (
                    <Select
                        defaultValue={false}
                        value={record.status}
                        style={{
                            width: 120,
                        }}
                        onChange={(value) => {orderStatusChange(record.id, value)}}
                        options={[
                            {
                                label: 'Prepare',
                                value: 'Prepare'
                            },
                            {
                                label: 'In Process',
                                value: 'In Process'
                            },
                            {
                                label: 'Done',
                                value: 'Done'
                            },
                            {
                                label: 'Cancel',
                                value: 'Cancel'
                            },
                        ]}
                    />
                )
            }
        },
        {
            title: lang.get('strings.Pay-Order'),
            filters: filters_active,
            onFilter: (value, record) => {
                if (record.pay_order == value) {
                    return true;
                }
            },
            render: (record) => {
                    if (record.pay_order) {
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
                    <div className="flex gap-3 justify-center">
                        <EyeOutlined style={{ fontSize: 19 }} title={lang.get('strings.Detail')} onClick={
                            () => {
                                Inertia.get(route('orders.show', { order: record.id }));
                            }} />
                        <FileDoneOutlined style={{ fontSize: 19, color: '#1c5dfd' }} title={lang.get('strings.Detail-Bill')} onClick={
                            () => {
                                Inertia.get(route('bills.show', { order: record.id }));
                            }} />
                        <DeleteOutlined style={{ fontSize: 19, color: '#e80101' }} title={lang.get('strings.Delete')} onClick={() => {
                            showDeleteConfirm(record.id)
                        }} />
                    </div>
                )
            }
        },
    ];

    const onTableChange = (pagination, filters, sorter, extra) => {

    };

    const onDatePickChange = (date, dateString) => {
        const filteredOrders = props[0].orders.filter(order => {
            const orderDate = moment(order.created_at).format('YYYY-MM-DD');
            return orderDate === dateString;
        });
        setOrders(filteredOrders);
    };
    
    const onWeekPickChange = (date, dateString) => {
        const weekStart = moment(date, 'YYYY-MM-DD').startOf('week').format('YYYY-MM-DD');
        const weekEnd = moment(date, 'YYYY-MM-DD').endOf('week').format('YYYY-MM-DD');
        const filteredOrders = props[0].orders.filter(order => {
            const orderDate = moment(order.created_at).format('YYYY-MM-DD');
            return moment(orderDate).isBetween(weekStart, weekEnd, null, '[]');
        });
        setOrders(filteredOrders);
    };
    
    const onMonthPickChange = (date, dateString) => {
        const monthStart = moment(date, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
        const monthEnd = moment(date, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');
        const filteredOrders = props[0].orders.filter(order => {
            const orderDate = moment(order.created_at).format('YYYY-MM-DD');
            return moment(orderDate).isBetween(monthStart, monthEnd, null, '[]');
        });
        setOrders(filteredOrders);
    };
    
    const onQuarterPickChange = (date, dateString) => {
        const quarterStart = moment(date, 'YYYY-MM-DD').startOf('quarter').format('YYYY-MM-DD');
        const quarterEnd = moment(date, 'YYYY-MM-DD').endOf('quarter').format('YYYY-MM-DD');
        const filteredOrders = props[0].orders.filter(order => {
            const orderDate = moment(order.created_at).format('YYYY-MM-DD');
            return moment(orderDate).isBetween(quarterStart, quarterEnd, null, '[]');
        });
        setOrders(filteredOrders);
    };
    
    const onYearPickChange = (date, dateString) => {
        const yearStart = moment(date, 'YYYY-MM-DD').startOf('year').format('YYYY-MM-DD');
        const yearEnd = moment(date, 'YYYY-MM-DD').endOf('year').format('YYYY-MM-DD');
        const filteredOrders = props[0].orders.filter(order => {
            const orderDate = moment(order.created_at).format('YYYY-MM-DD');
            return moment(orderDate).isBetween(yearStart, yearEnd, null, '[]');
        });
        setOrders(filteredOrders);
    };
    
    const handleViewModeChange = (value) => {
        setViewMode(value);
    }

    const handlePickerTypeChange = (value) => {
        setPickerType(value);
    }

    const resetFilter = () => {
        setOrders(props[0].orders);
    }

    console.log(orders);
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{lang.get('strings.List-Order')}</h2>}
        >
            <Head title={lang.get('strings.List-Order')} />

            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>{lang.get('strings.List-Order')}</h2>
                </div>
                <div className="flex justify-between w-full mr:3 mb-4 sm:px-6 lg:px-8 mt-12">
                    <div>
                        <Select
                            size={"medium"}
                            defaultValue="date"
                            onChange={handlePickerTypeChange}
                            style={{
                                width: 100,
                            }}
                            options={pickerTypeOptions}
                        />
                        {
                            pickerType == 'date' ? 
                                <DatePicker onChange={onDatePickChange} />
                            :   ( pickerType == 'week' ? 
                                <DatePicker onChange={onWeekPickChange} picker="week"/>
                                : ( pickerType == 'month' ? 
                                    <DatePicker onChange={onMonthPickChange} picker="month"/>
                                    : ( pickerType == 'quarter' ? 
                                        <DatePicker onChange={onQuarterPickChange} picker="quarter"/>
                                        : ( pickerType == 'year' ? 
                                            <DatePicker onChange={onYearPickChange} picker="year"/> : 
                                            <RangePicker showTime size="medium"/>
                                        )
                                    ) 
                                )
                            )
                        }
                        <Select
                            size={"medium"}
                            defaultValue="View by list"
                            onChange={handleViewModeChange}
                            style={{
                                width: 200,
                                // border: '0!important',
                            }}
                            options={viewModeOptions}
                        />
                        <Button type="primary" size={'medium'} onClick={resetFilter}>
                            Reset
                        </Button>
                    </div>
                    <Search placeholder="input serial, customer name, ordered products" onChange={searchChangeHandler}
                            enterButton bordered size="medium" allowClear style={{ width: 304 }} />
                </div>
                <div className="flex justify-between w-full mr:3 mb-4 sm:px-6 lg:px-8 mt-2">
                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8 h-300">
                    {
                        viewMode === 'list' ? 
                        <CustomTable
                            columns={columns}
                            dataSource={orders.map(order => { return { ...order, key: order.serial, customer: order.customer === null ? '' : order.customer.full_name } })}
                            onChange={onTableChange} /> : 
                            <Calendar
                                localizer={localizer}
                                events={props[0].orders.map(order => {
                                    return {
                                        title: order.id,
                                        start: new Date(order.created_at),
                                        end: new Date(order.end_at),
                                    }
                                })}
                                startAccessor="start"
                                endAccessor="end"
                                showNeighboringMonth={false}
                                popup
                                defaultView='week'
                                min={new Date(2017, 10, 0, 8, 0, 0)}
                                max={new Date(2017, 10, 0, 23, 0, 0)} 
                          />
                    }
                </div>
            </div>
        </Authenticated>
    );
}
