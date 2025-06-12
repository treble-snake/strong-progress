import {Alert, Empty, Spin} from "antd";
import React from "react";

type LoadingProps = {
  fullscreen?: boolean;
  isLoading?: boolean;
  error?: Error | string;
}


export function Loader({fullscreen, tip}: {
  fullscreen?: boolean,
  tip?: string
}) {
  return <Spin size={'large'} fullscreen={Boolean(fullscreen)}
               tip={fullscreen ?
                 (tip || 'Loading data, please wait...')
                 : undefined}
               style={{margin: fullscreen ? undefined : '0 auto'}}
  />
}

export function LoadingError({error}: { error?: Error | string }) {
  if (error) {
    console.error('Error details: ', error)
  }
  return <Alert type={'error'} showIcon message={
    <>
      Failed to load data, please use browser inspector to get the details
      and report them through POPS using the `/pops-bot` Slack command.
      <br/>
      {error ? <>{error.toString()}</> : null}
    </>
  }/>
}

export function NoDataLoaded({
                               fullscreen = true,
                               isLoading,
                               error
                             }: LoadingProps) {
  if (isLoading) {
    return <Loader fullscreen={fullscreen}/>;
  }
  if (error) {
    return <LoadingError error={error}/>;
  }
  return <Empty
    description={'No data loaded - something must have gone wrong :('}/>;
}