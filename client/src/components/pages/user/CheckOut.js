import React from "react";
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Upload,
  Alert,
  Tooltip,
  Card,
} from "antd";

function CheckOut() {
  const [form] = Form.useForm();

  return (
    <>
      <Card>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 24 }}
          // initialValues={selectedRowData}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          className="row-col"
        >
          <Row>
            <Col span={16}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
}
export default CheckOut;
