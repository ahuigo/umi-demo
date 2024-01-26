import { ProTable, ProForm, ProFormText, ProFormSelect, FooterToolbar } from '@ant-design/pro-components';
import { Button } from 'antd';

export default () => {
  return <ProForm
    // layout="inline"
    layout="horizontal"
    submitter={{
      render: ({ submit }, dom) => <div>
        <Button onClick={submit} type="primary">创建</Button>
        <FooterToolbar>
          <Button onClick={submit} type="primary">创建(footer)</Button>
          {dom}
        </FooterToolbar>
      </div>,
    }}
    onFinish={(values) => Promise.resolve()}
  >
    <ProFormSelect
      name="heatmap_type"
      label="Heatmap Type"
      options={[
        { value: 'frame', label: 'Frame' },
      ]}
    />
    <ProFormText
      name="a"
      label="A"
    />
  </ProForm>;
};