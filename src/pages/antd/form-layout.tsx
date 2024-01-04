import { ProTable, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button } from 'antd';

export default () => {
  return <ProForm
    layout="inline"
    submitter={{
      render: ({ submit }, dom) => <div>
        <Button onClick={submit} type="primary">创建</Button>
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