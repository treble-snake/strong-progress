import {Button, notification, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import React from "react";
import {parseStrongCsv} from "@/engine/file-reader/client-file-reader";
import {useAtom, useSetAtom} from "jotai";
import {
  lastUploadedDateAtom,
  rawLiftHistoryAtom,
  rawLiftHistoryLoadingAtom
} from "@/components/data/atoms";
import {mapStrongAppData} from "@/engine/parsing";
import {Loader} from "@/components/common/Loading";

type SourceFileUploadProps = {
  text?: string;
}

export function SourceFileUpload({text}: SourceFileUploadProps) {
  const setRawData = useSetAtom(rawLiftHistoryAtom)
  const setLastUploadDate = useSetAtom(lastUploadedDateAtom);
  const [{
    isLoading,
    error
  }, setLoadingStatus] = useAtom(rawLiftHistoryLoadingAtom)

  if (error) {
    notification.error({
      message: error,
    })
  }

  return (
    <>
      {isLoading && <Loader fullscreen/>}
      <Upload
        name={'strong-export-file'}
        accept={'.csv'}
        showUploadList={false}
        maxCount={1}
        beforeUpload={(file) => {
          const reader = new FileReader()
          reader.readAsText(file);

          reader.onloadstart = () => {
            setLoadingStatus({isLoading: true, error: undefined})
          }
          reader.onerror = (e) => {
            setLoadingStatus({
              isLoading: false,
              error: 'Failed to read file: ' + e.target?.error?.message
            })
          }
          reader.onabort = (() => {
            setLoadingStatus({
              isLoading: false,
              error: 'File reading was aborted'
            })
          })
          reader.onload = async () => {
            const content = reader.result as string;
            const parsed = mapStrongAppData(await parseStrongCsv(content))
            console.log('Parsed items:', parsed.length);
            // setTimeout(() => {
            setLoadingStatus({isLoading: false, error: undefined})
            setRawData(parsed);
            setLastUploadDate(Date.now().toString())
            // }, 1500);
          };
          return false
        }}

      >
        <Button icon={<UploadOutlined/>}>{text || 'Select File'}</Button>
      </Upload>
    </>
  );
}