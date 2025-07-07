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
import dayjs from "dayjs";

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
  const [warning, setWarning] = React.useState<string | undefined>(undefined);
  const {notification} = App.useApp()

  const attemptSettingData = (parsed: RawSetData[], yearsToTrim: number) => {
    if (yearsToTrim === 0) {
      setRawData(parsed);
    } else {
      const cutoffDate = dayjs().subtract(yearsToTrim, 'year');
      setRawData(parsed.filter(set => {
        return dayjs(set.date).isAfter(cutoffDate);
      }));
    }
    setLastUploadDate(Date.now().toString());
  }

  React.useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error loading data',
        description: error,
      });
    }
  }, [error, notification])

  React.useEffect(() => {
    if (warning) {
      notification.warning({
        message: 'Warning',
        description: warning,
        duration: 10,
        onClose: () => setWarning(undefined)
      });
    }
  }, [warning, notification])

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
            let parsed: RawSetData[] = [];
            try {
              const content = reader.result as string;
              const jsonData = await parseCsv(content);

              // Detect file type based on headers
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
                console.debug('Parsed items count:', parsed.length);
              } else {
                throw new Error('Unable to parse JSON - empty or invalid data');
              }
            } catch (error) {
              console.error('Error parsing file:', error);
              return setLoadingStatus({
                isLoading: false,
                error: 'Failed to parse file: ' + (error instanceof Error ? error.message : String(error))
              });
            }

            if (parsed.length === 0) {
              setWarning('No data about performed sets was found in the file');
              return setLoadingStatus({isLoading: false, error: undefined});
            }

            let i: number;
            const cutoffYears = [0, 2, 1, 0.5, 0.25];
            for (i = 0; i < cutoffYears.length; i++) {
              const yearsToTrim = cutoffYears[i];
              try {
                console.debug('Attempting to set data with yearsToTrim:', yearsToTrim);
                attemptSettingData(parsed, yearsToTrim);
                break
              } catch (error) {
                // if this is an error related to storage quota
                if (error instanceof Error && 'name' in error && error.name === 'QuotaExceededError') {
                  // if we are at the last iteration, we will show the error
                  // otherwise we will just trim the data and try again
                  if (i === cutoffYears.length - 1) {
                    return setLoadingStatus({
                      isLoading: false,
                      error: 'Failed to save data: too large file (wow you train A LOT!), please get in touch to resolve this issue'
                    });
                  }
                } else {
                  // any other error will be treated as a failure to save data
                  return setLoadingStatus({
                    isLoading: false,
                    error: 'Failed to save data: ' + (error instanceof Error ? error.message : String(error))
                  });
                }
              }
            }

            if (i !== 0) {
              setWarning(`Due to the large file size, the data was trimmed to the last ${cutoffYears[i]} years. Sorry for the possible inconvenience, I'll be working on improving that.`);
            }
            setLoadingStatus({isLoading: false, error: undefined})
          }
          return false
        }}

      >
        <Button icon={<UploadOutlined/>}>{text || 'Select File'}</Button>
      </Upload>
    </>
  );
}
