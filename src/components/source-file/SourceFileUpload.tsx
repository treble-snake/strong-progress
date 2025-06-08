import {Button, notification, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import React from "react";
import {parseStrongCsv} from "@/engine/file-reader/client-file-reader";
import {useSetAtom} from "jotai";
import {rawLiftHistoryAtom} from "@/components/data/atoms";
import {mapStrongAppData} from "@/engine/parsing";

export function SourceFileUpload() {
  const setRawData = useSetAtom(rawLiftHistoryAtom)
  const [error, setError] = React.useState<string | null>(null);

  if (error) {
    notification.error({
      message: error,
    })
  }

  return (
    <Upload
      name={'strong-export-file'}
      accept={'.csv'}
      showUploadList={false}
      maxCount={1}
      beforeUpload={(file) => {
        const reader = new FileReader()
        reader.readAsText(file);

        reader.onerror = ((e) => {
          setError('Failed to read file: ' + e.target?.error?.message);
        })
        reader.onabort = ((e) => {
          setError('Failed to read file: ' + e.target?.error?.message);
        })
        reader.onload = async () => {
          const content = reader.result as string;
          const parsed = mapStrongAppData(await parseStrongCsv(content))
          console.log('Parsed items:', parsed.length);
          setRawData(parsed);
        };
        return false
      }}

    >
      <Button icon={<UploadOutlined/>}>Select File</Button>
    </Upload>
  );
}