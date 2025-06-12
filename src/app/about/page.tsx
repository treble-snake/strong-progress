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
          Hello, Gym Rat, and Welcome to <b>Strong Progress</b>! This application is designed for weightlifting
          enthusiasts who track their workouts using the Strong app.
          Its main goal is to help you analyze your workout logs to assess various aspects of your training progress.
        </Paragraph>
        <Paragraph>
          Currently, the primary feature allows you to upload your Strong app workout data (CSV) to visualize how well each of your lifts is progressing. This helps you spot potential plateaus, identify areas for improvement, and make more informed decisions about your training based on progressive overload principles.
        </Paragraph>
        <Paragraph>
          I&apos;ve starting building this initially for my own use, to dive deeper into my training log and optimize my progress. Seeing its potential benefit, I would like to share it with fellow lifters who might find it useful 😊
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
          Nothing is stored on any server. All the data you upload is processed and stored directly in your browser&apos;s local storage.
        </Paragraph>
        <Paragraph>
          This means:
        </Paragraph>
        <ul>
          <li><Paragraph>If you clear your browser&apos;s cache or local storage, your uploaded data will be lost.</Paragraph></li>
          <li><Paragraph>If you use a different browser or a different computer, you will need to upload your data file again.</Paragraph></li>
        </ul>
        <Paragraph>
          While this ensures your privacy (as your data never leaves your machine), it also means you are responsible for keeping a backup of your original CSV file. Future versions might explore options for cloud-based storage if there&apos;s user demand and appropriate privacy measures can be implemented.
        </Paragraph>
      </>
    ),
  },
  {
    slug: 'how-it-works',
    title: 'How It Works (For Nerds)',
    content: (
      <>
        <Paragraph>
          The progress analysis for each lift is based on comparing your performance in recent sessions to your established baseline. Here&apos;s a simplified overview:
        </Paragraph>
        <ul>
          <li><Paragraph><strong>Data Parsing:</strong> When you upload your CSV, the tool parses your workout history, identifying individual lifts and the sets, reps, and weight for each.</Paragraph></li>
          <li><Paragraph><strong>Session Comparison:</strong> For each lift, the system looks at your performance in the last few (typically 3-5) workout sessions where that lift was performed.</Paragraph></li>
          <li><Paragraph><strong>Performance Metrics:</strong> It primarily looks at changes in total volume (weight x reps x sets) and estimated 1 Rep Max (e1RM) for comparable sets. Other factors like RPE (Rate of Perceived Exertion), if available, might be considered in future enhancements.</Paragraph></li>
          <li><Paragraph><strong>Status Assessment:</strong></Paragraph>
            <ul>
              <li><Paragraph><strong>Progressing:</strong> Consistent increase in volume/e1RM.</Paragraph></li>
              <li><Paragraph><strong>Struggling:</strong> Minor or inconsistent improvements; performance may be fluctuating.</Paragraph></li>
              <li><Paragraph><strong>Plateaued:</strong> No significant improvement over several sessions.</Paragraph></li>
              <li><Paragraph><strong>Regressing:</strong> A noticeable decline in performance.</Paragraph></li>
              <li><Paragraph><strong>At Risk:</strong> Early signs that might lead to a plateau or regression if not addressed.</Paragraph></li>
              <li><Paragraph><strong>Not Sure:</strong> Insufficient data to make a clear determination (e.g., new lifts).</Paragraph></li>
            </ul>
          </li>
          <li><Paragraph><strong>Feedback:</strong> The goal is to provide a quick visual cue (the status icon and color) for each lift, so you can easily see what&apos;s going well and what might need attention in your programming or recovery.</Paragraph></li>
        </ul>
        <Paragraph>
          This is an evolving process, and the algorithm will likely be refined over time as more analytical features are added and more data patterns are observed.
        </Paragraph>
      </>
    ),
  },
  {
    slug: 'future-plans',
    title: 'Future Plans',
    content: (
      <Paragraph>
        The project is still in its early stages. Depending on user feedback and traction, more analytical features might be added. If you have suggestions or find any issues, please feel free to contribute or raise an issue on the GitHub repository.
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
              return <div key={slug} style={{ marginBottom: 24 }}> {/* Added some bottom margin for spacing */}
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
          <a href={'https://github.com/treble-snake/string-progress'}
             rel={'noopener noreferrer'} target={'_blank'}>GitHub</a>!
        </Paragraph>
      </Footer>
    </Layout>
  );
};
