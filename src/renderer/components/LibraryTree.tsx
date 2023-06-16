import { useState } from 'react';
import { Frame, Tab, TabBody, Tabs } from 'react95';

export const LibraryTree = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div
      className="fullsize"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <Tabs style={{ marginTop: 6 }} value={activeTab} onChange={setActiveTab}>
        <Tab value={0}>Artists</Tab>
        <Tab value={1}>Albums</Tab>
        <Tab value={2}>Shows</Tab>
        <Tab value={3}>Playlists</Tab>
      </Tabs>
      <TabBody style={{ flexGrow: 1 }}>
        <Frame variant="field" className="fullsize"></Frame>
      </TabBody>
    </div>
  );
};
