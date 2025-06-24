import {App, Button, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import React from "react";
import {parseCsv} from "@/engine/file-reader/client-file-reader";
import {useAtom, useSetAtom} from "jotai";
import {
  lastUploadedDateAtom,
  rawLiftHistoryAtom,
  rawLiftHistoryLoadingAtom
} from "@/components/data/atoms";
import {Loader} from "@/components/common/Loading";
import {mapStrongAppData} from "@/engine/parsing/strong-app";
import {mapHevyAppData} from "@/engine/parsing/heavy-app";
import {RawSetData} from "@/types";

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
  const {notification} = App.useApp()

  React.useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error loading data',
        description: error,
      });
    }
  }, [error, notification])

  return (
    <>
      {isLoading && <Loader fullscreen/>}
      <Upload
        disabled={isLoading}
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
            try {
              const content = reader.result as string;
              const jsonData = await parseCsv(content);

              // Detect file type based on headers
              let parsed: RawSetData[];
              if (jsonData.length > 0) {
                const firstRow = jsonData[0];
                // Check if it's a Hevy file by looking for Hevy-specific headers
                if ('superset_id' in firstRow && 'exercise_title' in firstRow) {
                  console.debug('Probably it is Hevy file format');
                  parsed = mapHevyAppData(jsonData);
                } else {
                  console.debug('Using Strong app format by default');
                  parsed = mapStrongAppData(jsonData);
                }
              } else {
                throw new Error('Unable to parse JSON - empty or invalid data');
              }

              console.debug('Parsed items:', parsed.length);
              setLoadingStatus({isLoading: false, error: undefined})
              setRawData(parsed);
              setLastUploadDate(Date.now().toString())
            } catch (error) {
              console.error('Error parsing file:', error);
              setLoadingStatus({
                isLoading: false,
                error: 'Failed to parse file: ' + (error instanceof Error ? error.message : String(error))
              });
            }
          };
          return false
        }}

      >
        <Button icon={<UploadOutlined/>}>{text || 'Select File'}</Button>
      </Upload>
    </>
  );
}
