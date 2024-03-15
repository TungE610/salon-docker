import {useState} from 'react';
import { Table, Typography } from 'antd';
const { Text } = Typography;
import styled from 'styled-components';

const MyTable = styled(Table)`
    .ant-table-thead > tr > th {
        background-color: #f0f0f0;
        color: #000;
    }
`;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function CustomTable(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: (changeableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
              if (index % 2 !== 0) {
                return false;
              }
              return true;
            });
            setSelectedRowKeys(newSelectedRowKeys);
          },
        },
        {
          key: 'even',
          text: 'Select Even Row',
          onSelect: (changeableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
              if (index % 2 !== 0) {
                return true;
              }
              return false;
            });
            setSelectedRowKeys(newSelectedRowKeys);
          },
        },
      ],
    };

    return (
        <>
            <MyTable {...props} 
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, showQuickJumper: true}}
                rowSelection={rowSelection}
                summary={(pageData) => {
                    let totalBorrow = 0;
                    let totalRepayment = 0;
                    pageData.forEach(({ borrow, repayment }) => {
                      totalBorrow += borrow;
                      totalRepayment += repayment;
                    });
                    return (
                      <>
                        <Table.Summary.Row fixed>
                          <Table.Summary.Cell index={0}>
                            <div className="font-bebas tracking-wider">Total</div>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text type="success" strong>{pageData.length}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
            />
        </>
    )
}
