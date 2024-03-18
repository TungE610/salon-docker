import React, { useState, useEffect, useRef } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import MyButton from '@/Components/Button';
import { Head } from '@inertiajs/inertia-react';
import { useLang } from '../Context/LangContext';
import CustomTable from '@/Components/CustomeTable';
import { Input, notification, Table, Typography, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Inertia } from '@inertiajs/inertia'
import Highlighter from 'react-highlight-words';
import noteIcon from '../../../public/images/notes.svg';
const { Text } = Typography;
import 'antd/dist/antd.css';

export default function Registrations(props) {

    const [registrations, setRegistrations] = useState(props.registrations);
    const [searchValue, setSearchValue] = useState('');
    const { lang } = useLang();
    const { Search } = Input;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [checkAllSelectedWaiting, setCheckAllSelectedWaiting] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
	const [edittingNote, setEdittingNote] = useState('')
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
              onClick={() => { handleSearch(selectedKeys, confirm, dataIndex)}}
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
              className=' bg-cyan-500 rounded-sm'
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
        setRegistrations(props.registrations.filter(item => (
            item.id.toString().includes(searchValue.toString()) ||
            item.phone_number.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.salon_name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.address.toLowerCase().includes(searchValue.toLowerCase())
        )));
    }, [searchValue])

	const accept = (e, record) => {
		e.preventDefault();

		setRegistrations(prev => prev.filter(registration => registration.id !== record.id))
		Inertia.post('/salons', record, {
			onSuccess: () => {
				openNotification('success',
					lang.get('strings.Successfully-Accepted'),
					lang.get('strings.Accepted-Salon-Added')
				);
			},
			onError: (error) => {
				openNotification('error',
					lang.get('strings.Somethings-went-wrong'),
					error.store
				);
			}
		});
	}
	const acceptAll = (selectedKeys) => {
		for (let i = 0; i < selectedKeys.length; i++) {
			
		}
	}


    const reject = (e, record) => {
        e.preventDefault();

		setRegistrations(prev => prev.filter(registration => registration.id !== record.id))
        Inertia.put(route('registrations.reject', { registration: record }), record, {
            onSuccess: () => {
                openNotification('success',
                    lang.get('strings.Successfully-Rejected'),
                    lang.get('strings.Salon-Rejected')
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.reject
                );
            }
        });
    }

	const note = (record) => {

        Inertia.put(route('registrations.note', { registration: record }), {edittingNote}, {
            onSuccess: () => {
                openNotification('success',
                    'Successfully add note',
                    'You have just update note',
                );
            },
            onError: (error) => {
                openNotification('error',
                    lang.get('strings.Somethings-went-wrong'),
                    error.reject
                );
            }
        });
    }

    const searchChangeHandler = (e) => {
        e.preventDefault();

        setSearchValue(e.target.value);
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            align: 'center',
            key: 'id',
            ...getColumnSearchProps('id'),
			render: (text, record) => {
                return (
                    <div className='flex gap-1 items-center'>
						<div>{text}</div>
					{
            record.note != null ? (record.note.length > 0 ? 
						<img src={noteIcon} alt="have a note"/> : "")  : ""
					}	
					</div>
                )
            }
        },
        {
            title: 'Salon Name',
            dataIndex: 'salon_name',
            key: 'salon_name',
            ...getColumnSearchProps('salon_name'),
        },
        Table.EXPAND_COLUMN,
        // {
        //     title: 'First Name',
        //     dataIndex: 'first_name',
        //     align: 'center',
        // },
        // {
        //     title: 'Last Name',
        //     dataIndex: 'last_name',
        //     align: 'center',
        // },
        {
            title: 'Email',
            dataIndex: 'email',
            align: 'center',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Phone Number',
            key: 'phone_number',
            dataIndex: 'phone_number',
			...getColumnSearchProps('phone_number'),
        },
        {
            title: 'Address',
            key: 'address',
            dataIndex: 'address',
			...getColumnSearchProps('address'),
        },
        {
            title: 'Package',
            key: 'package',
            dataIndex: 'package',
            width: 50
        },
        {
            title: 'Action',
            filters: [
                {
                    text: 'Waiting',
                    value: 'Waiting',
                },
                {
                    text: 'Accepted',
                    value: 'Accepted',
                },
                {
                    text: 'Rejected',
                    value: 'Rejected',
                },
            ],
            onFilter: (value, record) => record.status === value,
			defaultFilteredValue: ['Waiting'],
            render: (text, record) => {
                return (
                    record.status === 'Accepted' ?
                        <div className='flex justify-center font-bebas tracking-widest font-bold'>
                            <p className='text-sky-700'>
								Accepted
							</p>
                        </div> : (
                            record.status === 'Rejected' ?
                                <div className='flex justify-center font-bebas tracking-widest font-bold'>
                                    <p className='text-rose-500	'>Rejected</p>
                                </div> :
                                <div className='flex gap-x-1.5'>
                                    <form onSubmit={(e) => { accept(e, record) }}>
                                        <div>
                                            <MyButton type="submit" className="bg-sky-700 rounded-sm hover:bg-slate-300 hover:text-gray-950 text-white">
                                                {lang.get('strings.Accept')}
                                            </MyButton>
                                        </div>
                                    </form>
                                    <form onSubmit={(e) => { reject(e, record) }}>
                                        <div>
                                            <MyButton type="submit" className="bg-red-500 rounded-sm hover:bg-slate-300 hover:text-gray-950 text-white">{lang.get('strings.Reject')}
                                            </MyButton>
                                        </div>
                                    </form>
                                </div>
                        )
                )
            }
        },
    ];

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const getSelectedRows = (selectedRows) => {
        setSelectedRowKeys(selectedRows);

        let flag = true;

		console.log("check: ", selectedRows);
        if (selectedRows.length < 2) {
            flag = false;
        } else {
            for (let i = 0; i < selectedRows.length; i ++) {
                if (registrations.filter(registration => registration.key == selectedRows[i])[0].status != 'Waiting') {
                    flag = false;
                    break;
                }
            }
        }

        setCheckAllSelectedWaiting(flag);
    }

	console.log(checkAllSelectedWaiting);

	const editNote = (e) => {
		setEdittingNote(e.target.value);
	}

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            notificationNumber={props.unreadNotificationsCount}
        >
            <Head title="Registrations" />
            <div className="py-6">
                <div className='sm:px-6 lg:px-8 w-full'>
                    <h2 className='font-semibold font-bebas tracking-wider text-2xl text-gray-800 leading-tight'>{lang.get('strings.Registrations')}</h2>
                </div>
                <div className="flex gap-2 justify-end w-full mr:3 mb-8 sm:px-6 lg:px-8 mt-12">
                    <Button style={{fontWeight: 'bold' }} shape="round" size="large" className={` multirow-action-btn ${selectedRowKeys.length > 0 ? 'show' : "" }`} style={{backgroundColor: '#fcba03', borderColor: '#ab800c'}}>
                        <div className="flex items-center gap-3 font-bebas text-lg tracking-wider text-black">
                            Remove
                        </div>
                    </Button>
                    <Button style={{fontWeight: 'bold' }} shape="round" size="large" className={` multirow-action-btn ${checkAllSelectedWaiting ? 'show' : ''}`} style={{backgroundColor: 'rgb(3 105 161)', borderColor: 'rgb(7 89 133)', color: 'white'}}>
                        <div className="flex items-center gap-3 font-bebas text-lg tracking-wider">
                            Accept All
                        </div>
                    </Button>   
                    <Button style={{fontWeight: 'bold' }} shape="round" size="large" className={` multirow-action-btn ${checkAllSelectedWaiting ? 'show' : ''}`} style={{backgroundColor: 'rgb(239 68 68)', borderColor: 'rgb(220 38 38)', color: 'white'}}>
                        <div className="flex items-center gap-3 font-bebas text-lg tracking-wider">
                            Reject All
                        </div>
                    </Button>
                    <Search placeholder="input id, salon name, address"
                        enterButton bordered
                        size="large"
                        allowClear	
                        onChange={ searchChangeHandler }
                        style={{
                            width: 304,
                        }} />

                </div>
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
					<CustomTable
						columns={columns}
						dataSource={registrations}
						summary={(pageData) => {
							return (
							<>
								<Table.Summary.Row fixed>
								<Table.Summary.Cell index={0}>
									<div className="font-bebas tracking-wider">Waiting</div>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1}>
									<Text type="success" strong>{registrations.filter(item => item.status == 'Waiting').length}</Text>
								</Table.Summary.Cell>
								</Table.Summary.Row>
								<Table.Summary.Row fixed>
								<Table.Summary.Cell index={0}>
									<div className="font-bebas tracking-wider">Accepted</div>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1}>
									<Text type="success" strong>{registrations.filter(item => item.status == 'Accepted').length}</Text>
								</Table.Summary.Cell>
								</Table.Summary.Row>
								<Table.Summary.Row fixed>
								<Table.Summary.Cell index={0}>
									<div className="font-bebas tracking-wider">Rejected</div>
								</Table.Summary.Cell>
								<Table.Summary.Cell index={1}>
									<Text type="success" strong>{registrations.filter(item => item.status == 'Rejected').length}</Text>
								</Table.Summary.Cell>
								</Table.Summary.Row>
							</>
							);
						}}
						expandable={{
						expandedRowRender: (record) => (
							<div>
								<p
								style={{
									marginTop: 3,
									
								}}
								>
									{record.description}
								</p>
								<div className='flex gap-4 items-center'>
									<div className='font-bold flex items-center'>Note: </div> 
										<Input style={{width: 450}} defaultValue={record.note} onChange={editNote}/> 
										<Button onClick={() => note(record)} type="primary"> Save </Button>
								</div>
							</div>
							),
							rowExpandable: (record) => record.name !== 'Not Expandable',
							}}
							getSelectedRows={getSelectedRows}
					/>
                </div>
            </div>
        </Authenticated>
    );
}
