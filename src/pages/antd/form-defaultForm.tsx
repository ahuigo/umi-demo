import { ProForm, ProFormText } from "@ant-design/pro-components";
import { useState } from "react";

export default () => {
  const [urls, setUrls] = useState({ left: '', right: '' });

  const handleFormSubmit = async ({ left, right }: any) => {
    setUrls({ left, right });
  };

  return (
    <div className="">
      <div>
        <ProForm onFinish={handleFormSubmit}>
          <ProForm.Group>
            <ProFormText name="left" label="Left URL" />
            <ProFormText name="right" label="Right URL" />
          </ProForm.Group>
        </ProForm>
      </div>
      <div className="flex">
        <div className="flex-1"><iframe src={urls.left} /></div>
        <div className="flex-1"><iframe src={urls.right} /></div>
      </div>
    </div>
  );
};
