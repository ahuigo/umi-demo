import { ProTable, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';

export default () => {
  const [form] = Form.useForm();
  return <ProForm
    layout="inline"
    submitter={{
      render: ({ submit }, dom) => <div>
        <Button onClick={submit} type="primary">创建</Button>
      </div>,
    }}
    form={form}
    onFinish={(values) => Promise.resolve()}
  >
    <ProFormSelect
      name="username"
      label="username"
      options={[
        { value: 'frame', label: 'Frame' },
        { value: 'frame2', label: 'Frame2' },
      ]}
    />
    <Form.Item noStyle shouldUpdate>
      {() => {
        const username = form.getFieldValue("username");
        console.log(username);
        return (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: form.getFieldValue("username") === "111",
                message: "Please input your password!"
              }
            ]}
          >
            {/* <Input placeholder={username} /> */}
            <ProFormText placeholder={username} />
          </Form.Item>
        );
      }}
    </Form.Item>
  </ProForm>;
};