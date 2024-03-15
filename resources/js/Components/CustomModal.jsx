import { Modal } from 'antd';
import styled from 'styled-components';

const MyModal = styled(Modal)`
    .ant-modal {
        width: 700px;
    };
    .ant-modal-header {
        background-color: #bae0ff;
        border-radius: 5px 5px 0 0;
    };
    .ant-modal-content {
        border-radius: 5px;
    }
`;

export default function CustomModal(props) {

    return (
        <MyModal {...props}/>
    )
}
