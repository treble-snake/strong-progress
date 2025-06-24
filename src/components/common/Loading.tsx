import {Alert, Empty, Spin, Typography} from "antd";
import React from "react";
import {GithubUrl, RedditUrl} from "@/constants";
import Link from "next/link";

type LoadingProps = {
  fullscreen?: boolean;
  isLoading?: boolean;
  error?: Error | string;
}

const {Text} = Typography;

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
      Something went wrong 😓
      <br/>
      Please get in touch on{' '}
      <Link href={RedditUrl} target={'_blank'}>Reddit</Link> or{' '}
      <Link href={GithubUrl} target={'_blank'}>Github</Link> to let me know.
      <br/>
      Meanwhile, try refreshing the page or cleaning the browser cache?
      Sorry for the inconvenience! 🙏
      <br/>
      Here are some details that might help me investigate, please copy them
      over:
      <br/>
      <br/>
      <Text copyable>
        {error ? error.toString() : 'Unknown error'}
      </Text>
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
    description={<>
      Something went wrong - not data was loaded 😓
      <br/>
      Please get in touch on{' '}
      <Link href={RedditUrl} target={'_blank'}>Reddit</Link> or{' '}
      <Link href={GithubUrl} target={'_blank'}>Github</Link> to let me know.
      <br/>
      Meanwhile, try refreshing the page or cleaning the browser cache?
      Sorry for the inconvenience! 🙏
    </>}/>;
}