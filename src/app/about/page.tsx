'use client';
import React, {ReactNode} from 'react';
import {Anchor, Layout, Typography} from 'antd';

const {Paragraph, Title} = Typography;
const {Sider, Content, Footer} = Layout;

const Sections: {
  slug: string;
  title: string;
  content: ReactNode;
}[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    content: (
      <>
        <Paragraph>
          Hello, Gym Rat, and Welcome to <b>Strong Progress</b>! This
          application is designed for weightlifting
          enthusiasts who track their workouts using the Strong app.
          Its main goal is to help you analyze your workout logs to assess
          various aspects of your training progress.
        </Paragraph>
        <Paragraph>
          Currently, the primary feature allows you to upload your Strong app
          workout data (CSV) to visualize how well each of your lifts is
          progressing. This helps you spot potential plateaus, identify areas
          for improvement, and make more informed decisions about your training
          based on progressive overload principles.
        </Paragraph>
        <Paragraph>
          I&apos;ve starting building this initially for my own use, to dive
          deeper into my training log and optimize my progress. Seeing its
          potential benefit, I would like to share it with fellow lifters who
          might find it useful 😊
        </Paragraph>
      </>
    ),
  },
  {
    slug: 'where-is-the-data-stored',
    title: 'Where is the data stored?',
    content: (
      <>
        <Paragraph>
          Nothing is stored on any server at the moment (but it may in the
          future).
          All the data you upload is processed and stored directly in your
          browser&apos;s local storage.
          So very big log files might take a bit of time to process, if your
          hardware is not very powerful.
        </Paragraph>
        <Paragraph>
          This also means, that things like UI and filter settings, uploaded
          data and so on are only available on the device you uploaded them
          from.
          So clearing your browser&apos;s cache or using a different device will
          require you to re-upload and re-configure your data file.
        </Paragraph>
      </>
    ),
  },
  {
    slug: 'how-it-works',
    title: 'How It Works (for nerds like me)',
    content: (
      <>
        <Title level={3}>Progress Analysis Algorithm</Title>
        <Paragraph>
          The progress analysis for each lift is based on comparing your
          performance in recent sessions to your established baseline.
          Here&apos;s a simplified overview:
        </Paragraph>
        <ul>
          <li><Paragraph><strong>Data Parsing:</strong> When you upload your
            CSV, the tool parses your workout history, identifying individual
            lifts and the sets, reps, and weight for each. Similar lifts
            performed on different sessions are tracked separately, as it may
            affect your performance significantly.</Paragraph></li>
          <li><Paragraph><strong>Session by Session Comparison:</strong> For
            each lift, the system looks at your performance in the last few
            (typically 3-5) workout sessions where that lift was
            performed.</Paragraph></li>
          <li><Paragraph><strong>Performance Metrics:</strong> It goes set by
            set and primarily looks at changes in weight and reps. The first set
            different between days will determine performance on that day.
            It&apos;s considered an increase in performance if you used more
            weight or have done more reps. If either weight or reps are
            dramatically different (e.g. in a deload), the system will say Not
            Sure.</Paragraph></li>
          <li><Paragraph><strong>Feedback:</strong> The goal is to provide a
            quick visual cue (the status icon and color) for each lift, so you
            can easily see what&apos;s going well and what might need attention
            in your programming or recovery.</Paragraph></li>
        </ul>
        <Paragraph>
          This is an evolving process, and the algorithm will likely be refined
          over time. Also, I plan to add configurable parameters in the future,
          so you can adjust how sensitive the analysis is to changes in your
          performance.
        </Paragraph>
      </>
    ),
  },
  {
    slug: 'future-plans',
    title: 'Future Plans',
    content: (
      <Paragraph>
        The project is still in its early stages. Depending on user feedback and
        traction, more analytical features might be added. If you have
        suggestions or find any issues, please feel free to contribute or raise
        an issue on the GitHub repository.
      </Paragraph>
    ),
  },
];

export default function AboutPage() {
  return (
    <Layout>
      <Layout>
        <Sider
          width={300}
          style={{backgroundColor: 'transparent'}}
        >
          <Anchor
            items={Sections.map(({slug, title}) => ({
              title: title,
              key: slug,
              href: `#${slug}`
            }))}
          />

        </Sider>
        <Content style={{maxWidth: 800}}>
          <Title level={1}>About the project</Title>
          {
            Sections.map(({slug, title, content}) => {
              return <div key={slug}
                          style={{marginBottom: 24}}> {/* Added some bottom margin for spacing */}
                <Title level={2} id={slug}>{title}</Title>
                {content} {/* Content is now rendered directly as it's JSX */}
              </div>;
            })
          }
        </Content>
      </Layout>
      <Footer style={{marginTop: 20, backgroundColor: 'transparent'}}>
        <Paragraph>
          In case of questions or suggestions, get in touch on{' '}
          <a href={'https://github.com/treble-snake/strong-progress'}
             rel={'noopener noreferrer'} target={'_blank'}>GitHub</a>!
        </Paragraph>
      </Footer>
    </Layout>
  );
};
